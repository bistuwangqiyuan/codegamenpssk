param(
    [Parameter(Mandatory=$false)]
    [string]$Json = ""
)

# Get current branch
$currentBranch = git branch --show-current 2>$null

if (!$currentBranch -or $currentBranch -eq "main" -or $currentBranch -eq "master") {
    Write-Error "Not on a feature branch. Please run /speckit.specify first."
    exit 1
}

# Find the feature directory based on branch name
$featureName = $currentBranch -replace '^feature/', ''
$featureDir = ".specify/features/$featureName"

if (!(Test-Path $featureDir)) {
    Write-Error "Feature directory not found: $featureDir"
    exit 1
}

$specFile = "$featureDir/spec.md"
if (!(Test-Path $specFile)) {
    Write-Error "Feature spec not found: $specFile"
    exit 1
}

# Create plans directory if it doesn't exist
$plansDir = "$featureDir/plans"
if (!(Test-Path $plansDir)) {
    New-Item -ItemType Directory -Force -Path $plansDir | Out-Null
}

# Copy plan template
$planTemplate = ".specify/templates/plan-template.md"
$implPlan = "$plansDir/implementation-plan.md"

if (!(Test-Path $implPlan)) {
    if (Test-Path $planTemplate) {
        Copy-Item $planTemplate $implPlan
    } else {
        # Create a basic plan file
        "# Implementation Plan" | Out-File -FilePath $implPlan -Encoding UTF8
    }
}

# Get absolute paths
$absSpecFile = (Resolve-Path $specFile).Path
$absImplPlan = (Resolve-Path $implPlan).Path
$absFeatureDir = (Resolve-Path $featureDir).Path
$absPlansDir = (Resolve-Path $plansDir).Path

# Output JSON result
$result = @{
    BRANCH = $currentBranch
    FEATURE_SPEC = $absSpecFile
    IMPL_PLAN = $absImplPlan
    FEATURE_DIR = $absFeatureDir
    SPECS_DIR = $absFeatureDir
    PLANS_DIR = $absPlansDir
} | ConvertTo-Json -Compress

Write-Output $result
