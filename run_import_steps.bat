@echo off
REM Enhanced Inventory Import - Step by Step Execution
REM This batch file runs the import process using Supabase CLI

echo === Enhanced Inventory Import Process ===
echo Starting at: %DATE% %TIME%
echo.

REM Check if Supabase CLI exists
if not exist "supabase.exe" (
    echo ERROR: supabase.exe not found in current directory
    echo Please ensure Supabase CLI is available
    pause
    exit /b 1
)

REM Check if CSV file exists
if not exist "enriched_inventory.csv" (
    echo ERROR: enriched_inventory.csv not found
    echo Please ensure the CSV file is in the current directory
    pause
    exit /b 1
)

echo === Step 1: Apply Migration ===
echo Applying database migration to set up import structures...
echo.
supabase.exe db push --include-all
if errorlevel 1 (
    echo ERROR: Migration failed
    echo Please check your database connection and try again
    pause
    exit /b 1
)
echo Migration completed successfully
echo.

REM Give user option to review before proceeding
echo === Step 2: Load CSV Data ===
echo About to load CSV data into staging table...
echo Press any key to continue or Ctrl+C to cancel
pause >nul

echo Loading CSV data into staging table...
echo.
type load_csv_to_staging.sql
supabase.exe db push
if errorlevel 1 (
    echo ERROR: CSV loading failed
    echo This might be due to CSV format issues or database connection problems
    pause
    exit /b 1
)
echo CSV data loaded successfully
echo.

REM Give user option to review staging data before import
echo === Step 3: Execute Import ===
echo About to execute the main import process...
echo This will validate and import data from staging to main_site_products
echo Press any key to continue or Ctrl+C to cancel
pause >nul

echo Executing import process...
echo.
echo SELECT * FROM execute_enriched_inventory_import(); > temp_import.sql
supabase.exe db push --file temp_import.sql
del temp_import.sql
if errorlevel 1 (
    echo WARNING: Import process may have had issues
    echo Check the output above for details
) else (
    echo Import process completed
)
echo.

echo === Step 4: Verification ===
echo Getting import summary...
echo.
echo SELECT * FROM get_import_summary(); > temp_summary.sql
supabase.exe db push --file temp_summary.sql
del temp_summary.sql
echo.

echo Getting sample of imported products...
echo.
echo SELECT name, sku, brand_id, category_id, our_price, sale_price, stock_quantity, inventory_status, is_active FROM main_site_products ORDER BY created_at DESC LIMIT 5; > temp_sample.sql
supabase.exe db push --file temp_sample.sql
del temp_sample.sql
echo.

echo === Import Process Complete ===
echo Completed at: %DATE% %TIME%
echo.
echo CSV file processed: enriched_inventory.csv
echo.
echo Next steps:
echo 1. Review the import summary above
echo 2. Check for failed imports: SELECT * FROM import_progress_view WHERE import_status = 'failed';
echo 3. Update product compliance information based on product types
echo 4. Review and enhance cannabinoid/effects profiles as needed
echo.
echo Press any key to exit
pause >nul
