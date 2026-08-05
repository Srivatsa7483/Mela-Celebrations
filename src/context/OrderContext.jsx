import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext.jsx";

export const OrderContext = createContext();

export function OrderProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Load wishlist on startup or user change
  useEffect(() => {
    const key = user ? `mela_wishlist_${user.email}` : "mela_wishlist_anonymous";
    const savedWishlist = localStorage.getItem(key);
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (err) {
        console.error("Failed to parse wishlist from localStorage:", err);
        setWishlist([]);
        localStorage.removeItem(key);
      }
    } else {
      setWishlist([]);
    }

    if (user) {
      fetchUserOrders(user.email);
    } else {
      setOrders([]);
    }
  }, [user]);

  const fetchUserOrders = async (email) => {
    setLoadingOrders(true);
    try {
      const res = await fetch(`/api/bookings/user/${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }
    } catch (error) {
      console.error("Failed to fetch user bookings:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const createBooking = async (bookingData) => {
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create booking");
      }
      // Add to local state
      setOrders((prev) => [data.booking, ...prev]);
      return data.booking;
    } catch (error) {
      console.error("Booking creation error:", error);
      throw error;
    }
  };

  const toggleWishlist = (designId) => {
    setWishlist((prev) => {
      const id = Number(designId);
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      
      const key = user ? `mela_wishlist_${user.email}` : "mela_wishlist_anonymous";
      localStorage.setItem(key, JSON.stringify(updated));
      return updated;
    });
  };

  const updateBookingStatusAdmin = async (bookingId, status) => {
    try {
      const token = localStorage.getItem("mela_token");
      const headers = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update booking status");
      }
      
      // Update local state
      setOrders((prev) =>
        prev.map((order) => (order.id === bookingId ? data.booking : order))
      );
      return data.booking;
    } catch (error) {
      console.error("Status update error:", error);
      throw error;
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        wishlist,
        loadingOrders,
        fetchUserOrders,
        createBooking,
        toggleWishlist,
        updateBookingStatusAdmin,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}
