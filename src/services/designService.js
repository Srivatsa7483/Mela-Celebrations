import { designs as staticDesigns, categories as staticCategories } from "../data/index.js";

// Make sure memory arrays are initialized with local storage values on first load
let designsArray = staticDesigns;
let categoriesArray = staticCategories;

if (typeof window !== "undefined") {
  const storedDesigns = localStorage.getItem("mela_designs");
  if (storedDesigns) {
    try {
      const parsed = JSON.parse(storedDesigns);
      // Mutably update the imported staticDesigns array so all imports share the loaded state!
      staticDesigns.length = 0;
      staticDesigns.push(...parsed);
      designsArray = staticDesigns;
    } catch (e) {
      console.error(e);
    }
  } else {
    localStorage.setItem("mela_designs", JSON.stringify(staticDesigns));
  }

  const storedCategories = localStorage.getItem("mela_categories");
  if (storedCategories) {
    try {
      const parsed = JSON.parse(storedCategories);
      const hasFlower = parsed.some(c => c.id === 'flower');
      const kidsCat = parsed.find(c => c.id === 'kidsactivities');
      const hasKidsDropdown = kidsCat && kidsCat.dropdown && kidsCat.dropdown.length > 0;
      
      if (hasFlower && hasKidsDropdown) {
        staticCategories.length = 0;
        staticCategories.push(...parsed);
        categoriesArray = staticCategories;
      } else {
        localStorage.setItem("mela_categories", JSON.stringify(staticCategories));
      }
    } catch (e) {
      console.error(e);
    }
  } else {
    localStorage.setItem("mela_categories", JSON.stringify(staticCategories));
  }
}

export async function getDesigns() {
  return designsArray;
}

export async function getCategories() {
  return categoriesArray;
}

export async function createDesign(newDesign) {
  const designWithId = {
    ...newDesign,
    id: designsArray.length > 0 ? Math.max(...designsArray.map(d => Number(d.id) || 0)) + 1 : 1001
  };
  
  // Mutably add to the shared array so all components see it immediately!
  designsArray.unshift(designWithId);
  
  // Save to localStorage
  localStorage.setItem("mela_designs", JSON.stringify(designsArray));
  
  return designWithId;
}

export async function deleteDesign(designId) {
  const idToCompare = Number(designId);
  
  // Mutably delete from the shared array so all components sync immediately!
  const index = designsArray.findIndex(d => Number(d.id) === idToCompare);
  if (index !== -1) {
    designsArray.splice(index, 1);
  }
  
  // Save updated array to localStorage
  localStorage.setItem("mela_designs", JSON.stringify(designsArray));
  return true;
}

export async function uploadImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
