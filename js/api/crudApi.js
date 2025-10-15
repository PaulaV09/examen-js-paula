const URL_API = "http://localhost:3000";

const myHeaders = new Headers({
  "Content-Type": "application/json",
});

const getInfo = async (category, id = null) => {
  try {
    const endpoint = id
      ? `${URL_API}/${category}/${id}`
      : `${URL_API}/${category}`;
    const response = await fetch(endpoint);
    if (!response.ok)
      throw new Error(
        `Error ${response.status}: No se pudo obtener ${category}`
      );
    return await response.json();
  } catch (error) {
    console.error(`❌ Error en GET (${category}):`, error.message);
  }
};

const postInfo = async (category, data) => {
  try {
    const response = await fetch(`${URL_API}/${category}`, {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(data),
    });
    if (!response.ok)
      throw new Error(
        `Error ${response.status}: No se pudo crear en ${category}`
      );
    return await response.json();
  } catch (error) {
    console.error(`❌ Error en POST (${category}):`, error.message);
  }
};

const patchInfo = async (category, id, data) => {
  try {
    const response = await fetch(`${URL_API}/${category}/${id}`, {
      method: "PATCH",
      headers: myHeaders,
      body: JSON.stringify(data),
    });
    if (!response.ok)
      throw new Error(
        `Error ${response.status}: No se pudo actualizar ${category}`
      );
    return await response.json();
  } catch (error) {
    console.error(`❌ Error en PATCH (${category}):`, error.message);
  }
};

const deleteInfo = async (category, id) => {
  try {
    const response = await fetch(`${URL_API}/${category}/${id}`, {
      method: "DELETE",
      headers: myHeaders,
    });
    if (!response.ok)
      throw new Error(
        `Error ${response.status}: No se pudo eliminar de ${category}`
      );
    return await response.json();
  } catch (error) {
    console.error(`❌ Error en DELETE (${category}):`, error.message);
  }
};

const findInfo = async (category, queryObj) => {
  try {
    const queryString = new URLSearchParams(queryObj).toString();
    const response = await fetch(`${URL_API}/${category}?${queryString}`);
    if (!response.ok)
      throw new Error(
        `Error ${response.status}: No se pudo buscar en ${category}`
      );
    return await response.json();
  } catch (error) {
    console.error(`❌ Error en FIND (${category}):`, error.message);
  }
};

export { getInfo, postInfo, patchInfo, deleteInfo, findInfo };
