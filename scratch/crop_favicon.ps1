# Load System.Drawing assembly
Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\sriva\.gemini\antigravity-ide\brain\e39f1b49-79f3-4951-ae63-ec48d9b6f889\media__1779542874978.png"
$destPng = "c:\Users\sriva\Downloads\Mela-Celebrations-final\Mela-Celebrations-final\public\favicon.png"
$destIco = "c:\Users\sriva\Downloads\Mela-Celebrations-final\Mela-Celebrations-final\public\favicon.ico"

# Open the source bitmap
$bmp = New-Object System.Drawing.Bitmap($srcPath)
$width = $bmp.Width
$height = $bmp.Height

# Find bounding box of non-transparent pixels (Alpha > 10)
$minX = $width
$maxX = 0
$minY = $height
$maxY = 0

for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
        $pixel = $bmp.GetPixel($x, $y)
        if ($pixel.A -gt 10) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

# Close source bitmap to free file lock if any
$bmp.Dispose()

# Re-open (since we disposed it)
$bmp = New-Object System.Drawing.Bitmap($srcPath)

# Calculate cropped size
$cropWidth = $maxX - $minX + 1
$cropHeight = $maxY - $minY + 1

# Safety checks
if ($cropWidth -le 0 -or $cropHeight -le 0) {
    Write-Host "No visible pixels found!"
    exit 1
}

Write-Host "Cropping image from size ${width}x${height} to ${cropWidth}x${cropHeight} (X: $minX..$maxX, Y: $minY..$maxY)"

# Create new bitmap
$croppedBmp = New-Object System.Drawing.Bitmap($cropWidth, $cropHeight)
$g = [System.Drawing.Graphics]::FromImage($croppedBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

# Draw the portion of the original image onto the new one
$srcRect = New-Object System.Drawing.Rectangle($minX, $minY, $cropWidth, $cropHeight)
$destRect = New-Object System.Drawing.Rectangle(0, 0, $cropWidth, $cropHeight)
$g.DrawImage($bmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

# Dispose graphics and old bitmap
$g.Dispose()
$bmp.Dispose()

# Save as PNG
$croppedBmp.Save($destPng, [System.Drawing.Imaging.ImageFormat]::Png)
$croppedBmp.Save($destIco, [System.Drawing.Imaging.ImageFormat]::Png)
$croppedBmp.Dispose()

Write-Host "Success! Cropped favicon saved successfully!"
