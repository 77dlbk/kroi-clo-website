# Simple PowerShell HTTP Server for static files
# Uses .NET HttpListener

$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
try {
    $listener.Start()
    Write-Host "PowerShell HTTP Server started on http://localhost:$port/"
} catch {
    Write-Error "Failed to start listener. Is port $port already in use?"
    exit
}

$baseDir = "C:\Users\user\.gemini\antigravity-ide\scratch\asel-sewing-factory"

# Simple loop to handle requests
while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $urlPath = $request.RawUrl.Split('?')[0]
        if ($urlPath -eq "/") {
            $urlPath = "/index.html"
        }
        
        # Construct local file path
        $cleanPath = $urlPath.Replace("/", "\").TrimStart('\')
        $filePath = Join-Path $baseDir $cleanPath
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            # Basic content type detection
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".gif"  { "image/gif" }
                ".svg"  { "image/svg+xml" }
                ".webp" { "image/webp" }
                ".json" { "application/json; charset=utf-8" }
                default { "application/octet-stream" }
            }
            
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $notFoundBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $urlPath")
            $response.ContentType = "text/plain; charset=utf-8"
            $response.ContentLength64 = $notFoundBytes.Length
            $response.OutputStream.Write($notFoundBytes, 0, $notFoundBytes.Length)
        }
        $response.Close()
    } catch {
        # Catch errors to prevent server from crashing unexpectedly
        Write-Host "Request error: $_"
    }
}
$listener.Close()
