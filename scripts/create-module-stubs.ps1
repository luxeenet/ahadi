$modules = @('auth','identity','profiles','businesses','groups','commitments','commitment-templates','milestones','evidence','verification','trust','marketplace','payments','ledger','disputes','messaging','notifications','ai','fraud','audit','admin','public')

foreach ($mod in $modules) {
    $dir = "C:\Users\ahadi\apps\api\src\modules\$mod"
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    $parts = $mod -split '-'
    $pascal = ($parts | ForEach-Object { $_.Substring(0,1).ToUpper() + $_.Substring(1) }) -join ''
    $content = "import { Module } from '@nestjs/common';`n`n@Module({`n  controllers: [],`n  providers: [],`n  exports: [],`n})`nexport class ${pascal}Module {}"
    $filePath = Join-Path $dir "$mod.module.ts"
    Set-Content -Path $filePath -Value $content -Encoding UTF8
    Write-Host "Created $filePath"
}
Write-Host "All module stubs created."
