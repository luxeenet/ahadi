$content = '{"extends": "../../tsconfig.base.json", "compilerOptions": {"outDir": "./dist", "rootDir": "./src"}, "include": ["src/**/*"]}'
$pkgs = 'config', 'shared', 'types', 'events', 'database'
foreach ($p in $pkgs) {
    Set-Content -Path "C:\Users\ahadi\packages\$p\tsconfig.json" -Value $content -Encoding UTF8
    Write-Host "Created packages/$p/tsconfig.json"
}
Set-Content -Path "C:\Users\ahadi\apps\worker\tsconfig.json" -Value '{"extends": "../../tsconfig.base.json", "compilerOptions": {"outDir": "./dist", "rootDir": "./src", "module": "commonjs"}, "include": ["src/**/*"]}' -Encoding UTF8
Write-Host "Created apps/worker/tsconfig.json"
Write-Host "Done."
