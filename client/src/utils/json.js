export const formDataToJson = (formData) => {
  const jsonObject = {};
  console.log("🚀  formData.entries():", formData.entries());

  // Use the FormData.entries() method to iterate through key-value pairs
  for (const [key, value] of formData.entries()) {
    // If the key already exists, convert it into an array or append to the existing array
    if (jsonObject[key]) {
      if (Array.isArray(jsonObject[key])) {
        jsonObject[key].push(value);
      } else {
        jsonObject[key] = [jsonObject[key], value];
      }
    } else {
      jsonObject[key] = value;
    }
  }

  return jsonObject;
};
