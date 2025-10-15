param(
    [Parameter(Mandatory=$false)]
    [switch]$RequireTasks,
    [Parameter(Mandatory=$false)]
    [switch]$IncludeTasks,
    [Parameter(Mandatory=$false)]
    [string]$Json = ""
)

# Get current branch
$currentBranch = git branch --show-current 2>$null

if (!$currentBranch -or $currentBranch -eq "main" -or $currentBranch -eq "master") {
    Write-Error "Not on a feature branch"
    exit 1
}

# Find feature directory
$featureName = $currentBranch -replace '^feature/', ''
$featureDir = ".specify/features/$featureName"

if (!(Test-Path $featureDir)) {
    Write-Error "Feature directory not found: $featureDir"
    exit 1
}

# Check for required documents
$specFile = "$featureDir/spec.md"
$planFile = "$featureDir/plans/implementation-plan.md"
$tasksFile = "$featureDir/tasks.md"

$availableDocs = @()

if (Test-Path $specFile) {
    $availableDocs += "spec.md"
}

if (Test-Path $planFile) {
    $availableDocs += "implementation-plan.md"
}

if (Test-Path "$featureDir/plans/data-model.md") {
    $availableDocs += "data-model.md"
}

if (Test-Path "$featureDir/plans/research.md") {
    $availableDocs += "research.md"
}

if (Test-Path "$featureDir/plans/contracts") {
    $availableDocs += "contracts/"
}

if (Test-Path $tasksFile) {
    $availableDocs += "tasks.md"
}

# Check prerequisites
if ($RequireTasks -and !(Test-Path $tasksFile)) {
    Write-Error "tasks.md is required but not found"
    exit 1
}

# Get absolute paths
$absFeatureDir = (Resolve-Path $featureDir).Path
$absSpecFile = if (Test-Path $specFile) { (Resolve-Path $specFile).Path } else { $null }
$absPlanFile = if (Test-Path $planFile) { (Resolve-Path $planFile).Path } else { $null }
$absTasksFile = if (Test-Path $tasksFile) { (Resolve-Path $tasksFile).Path } else { $null }

# Output JSON
$result = @{
    BRANCH = $currentBranch
    FEATURE_DIR = $absFeatureDir
    SPEC_FILE = $absSpecFile
    PLAN_FILE = $absPlanFile
    TASKS_FILE = $absTasksFile
    AVAILABLE_DOCS = $availableDocs
} | ConvertTo-Json -Compress

Write-Output $result
