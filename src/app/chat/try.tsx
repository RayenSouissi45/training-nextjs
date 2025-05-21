const { data, error } = await supabase.from("users").select("*");
console.log("Data:", data);
console.log("Error:", error);
