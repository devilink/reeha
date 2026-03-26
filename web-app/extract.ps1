Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead('d:\LR\reeha\web-app\tnc.docx')
$entry = $zip.Entries | Where-Object { $_.FullName -eq 'word/document.xml' }
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$xmlStr = $reader.ReadToEnd()
$reader.Close()
$zip.Dispose()

$xmlStr = $xmlStr -replace '<w:p\b.*?>', "`n`n"
$text = $xmlStr -replace '<[^>]+>', ''
Set-Content -Path 'd:\LR\reeha\web-app\tnc.txt' -Value $text -Encoding UTF8
