param(
    [Parameter(Mandatory=$true)]
    [string]$Json
)

# Function to convert text to kebab-case
function ConvertTo-KebabCase {
    param([string]$text)
    
    # Remove special characters and convert to lowercase
    $text = $text -replace '[^\w\s-]', ''
    $text = $text.Trim().ToLower()
    # Replace spaces and underscores with hyphens
    $text = $text -replace '[\s_]+', '-'
    # Remove consecutive hyphens
    $text = $text -replace '-+', '-'
    
    return $text
}

# Generate branch name from description
$featureName = ConvertTo-KebabCase -text $Json
$branchName = "feature/$featureName"

# Limit branch name length
if ($branchName.Length -gt 60) {
    $branchName = $branchName.Substring(0, 60).TrimEnd('-')
}

# Create feature directory
$featureDir = ".specify/features/$featureName"
$specFile = "$featureDir/spec.md"

# Create directory if it doesn't exist
if (!(Test-Path $featureDir)) {
    New-Item -ItemType Directory -Force -Path $featureDir | Out-Null
}

# Create subdirectories
New-Item -ItemType Directory -Force -Path "$featureDir/checklists" | Out-Null
New-Item -ItemType Directory -Force -Path "$featureDir/plans" | Out-Null

# Get absolute paths
$absSpecFile = (Resolve-Path $specFile -ErrorAction SilentlyContinue).Path
if (!$absSpecFile) {
    $absSpecFile = (Join-Path (Get-Location).Path $specFile)
}

$absFeatureDir = (Resolve-Path $featureDir -ErrorAction SilentlyContinue).Path
if (!$absFeatureDir) {
    $absFeatureDir = (Join-Path (Get-Location).Path $featureDir)
}

# Create initial spec file if it doesn't exist
if (!(Test-Path $specFile)) {
    "# Feature Specification" | Out-File -FilePath $specFile -Encoding UTF8
}

# Checkout or create branch
$currentBranch = git branch --show-current 2>$null
if ($currentBranch -eq $branchName) {
    # Already on the branch
} else {
    $branchExists = git branch --list $branchName 2>$null
    if ($branchExists) {
        git checkout $branchName 2>&1 | Out-Null
    } else {
        git checkout -b $branchName 2>&1 | Out-Null
    }
}

# Output JSON result
$result = @{
    BRANCH_NAME = $branchName
    SPEC_FILE = $absSpecFile
    FEATURE_DIR = $absFeatureDir
    FEATURE_NAME = $featureName
} | ConvertTo-Json -Compress

Write-Output $result
