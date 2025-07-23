// Helper script to properly encode DATABASE_URL with special characters
console.log("DATABASE_URL Special Character Encoding Guide:");
console.log("===============================================");
console.log("");
console.log("If your password contains special characters like @ or !, you need to URL-encode them:");
console.log("");
console.log("@ should be encoded as: %40");
console.log("! should be encoded as: %21");
console.log("# should be encoded as: %23");
console.log("$ should be encoded as: %24");
console.log("% should be encoded as: %25");
console.log("& should be encoded as: %26");
console.log("");
console.log("Example:");
console.log("If your password is: MyPass@123!");
console.log("It should be encoded as: MyPass%40123%21");
console.log("");
console.log("Your DATABASE_URL should look like:");
console.log("postgresql://postgres.[PROJECT-REF]:MyPass%40123%21@db.qirbapivptotybspnbet.supabase.co:6543/postgres");
console.log("");

// Try to detect and suggest fixes for current DATABASE_URL
try {
  const rawUrl = process.env.DATABASE_URL;
  console.log("Current DATABASE_URL analysis:");
  console.log("Raw URL:", rawUrl?.substring(0, 50) + "...");
  
  if (rawUrl?.includes('@') && rawUrl?.split('@').length > 2) {
    console.log("⚠️  ISSUE DETECTED: Multiple @ symbols found - password likely contains unencoded @");
    console.log("✅  SOLUTION: Replace @ in password with %40");
  }
  
  if (rawUrl?.includes('!')) {
    console.log("⚠️  ISSUE DETECTED: ! symbol found - password likely contains unencoded !");
    console.log("✅  SOLUTION: Replace ! in password with %21");
  }
  
} catch (error) {
  console.log("Could not analyze DATABASE_URL");
}