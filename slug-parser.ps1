param (
    [Parameter(Mandatory = $true)]
    [string]$DirectoryPath
)

# Define the JSON files to read
$jsonFiles = Get-ChildItem -Path $DirectoryPath -Filter *.json | Select-Object -ExpandProperty FullName

# Prepare the output file name with the current date and time
$outputFileName = "Slugs_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".txt"
$outputFilePath = Join-Path -Path $DirectoryPath -ChildPath $outputFileName

# Create a hash set to store unique entries
$uniqueEntries = @{}

# Process each JSON file
foreach ($file in $jsonFiles) {
    # Read the JSON file
    $jsonContent = Get-Content -Path $file -Raw | ConvertFrom-Json

    # Extract the data for each cryptocurrency
    $cryptocurrencies = $jsonContent.data.PSObject.Properties.Value

    # Iterate over each cryptocurrency and add the name, symbol, and slug to the hash set
    foreach ($crypto in $cryptocurrencies) {
        $entry = "$($crypto.name);$($crypto.symbol);$($crypto.slug)"
        $uniqueEntries[$entry] = $true
    }
}

# Write unique entries to the output file
$uniqueEntries.Keys | Out-File -FilePath $outputFilePath