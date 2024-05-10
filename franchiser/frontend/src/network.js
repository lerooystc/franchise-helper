export async function login_account(username, password) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  };
  const response = await fetch(`/api/login/`, requestOptions);
  if (response.status !== 404) {
    const json = await response.json();
    return json["Token"];
  }
}

export function register_account(username, email, password) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username,
      email: email,
      password: password,
    }),
  };
  fetch("/api/register/", requestOptions)
    .then((response) => {
      if (response.ok) {
        login_account(username, password);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function logout_user() {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  };
  const response = await fetch(`/api/logout/`, requestOptions);
  const json = await response;
  return "Success!";
}

export async function get_partners() {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json", "Authorization": "Token " + localStorage.getItem('token') },
  };
  const response = await fetch("/api/partners/", requestOptions);
  const json = await response.json();
  return json;
}

export async function get_partner(key) {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json", "Authorization": "Token " + localStorage.getItem('token') },
  };
  const response = await fetch(`/api/partners/${key}/`, requestOptions);
  const json = await response.json();
  return json;
}

export function create_location(name, address, partner) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Token " + localStorage.getItem('token') },
    body: JSON.stringify({
      name: name,
      address: address,
      partner: partner,
    }),
  };
  fetch("/api/locations/", requestOptions)
    .then((response) => {
      if (response.ok) {
        return "Okay!";
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

export function create_contractor(name, partner) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Token " + localStorage.getItem('token') },
    body: JSON.stringify({
      name: name,
      partner: partner,
    }),
  };
  fetch("/api/contractors/", requestOptions)
    .then((response) => {
      if (response.ok) {
        return "Okay!";
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function get_location(key) {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json", "Authorization": "Token " + localStorage.getItem('token') },
  };
  const response = await fetch(`/api/locations/${key}/`, requestOptions);
  const json = await response.json();
  return json;
}

export async function edit_location(key, name) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "Authorization": "Token " + localStorage.getItem('token') },
    body: JSON.stringify({
      name: name
    }),
  };
  const response = await fetch(`/api/locations/${key}/`, requestOptions);
  const json = await response.json();
  return json;
}

export async function get_news(page) {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  const response = await fetch('/api/articles/?page=' + page, requestOptions);
  const json = await response.json();
  return json;
}

export async function delete_location(key) {
  const requestOptions = {
    method: "DELETE",
    headers: { "Content-Type": "application/json", "Authorization": "Token " + localStorage.getItem('token') },
  };
  await fetch(`/api/locations/${key}/`, requestOptions);
}

export async function get_contractor(key) {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json", "Authorization": "Token " + localStorage.getItem('token') },
  };
  const response = await fetch(`/api/contractors/${key}/`, requestOptions);
  const json = await response.json();
  return json;
}

export async function edit_contractor(key, name) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "Authorization": "Token " + localStorage.getItem('token') },
    body: JSON.stringify({
      name: name
    }),
  };
  const response = await fetch(`/api/contractors/${key}/`, requestOptions);
  const json = await response.json();
  return json;
}

export async function delete_contractor(key) {
  const requestOptions = {
    method: "DELETE",
    headers: { "Content-Type": "application/json", "Authorization": "Token " + localStorage.getItem('token') },
  };
  await fetch(`/api/contractors/${key}/`, requestOptions);
}

export async function get_tasks() {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json", "Authorization": "Token " + localStorage.getItem('token') },
  };
  const response = await fetch('/api/tasks/', requestOptions);
  const json = await response.json();
  return json;
}

export async function add_tasks(tasks) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Token " + localStorage.getItem('token') },
    body: JSON.stringify(tasks),
  };
  const response = await fetch(`/api/tasks/bulk_save/`, requestOptions);
  const json = await response.json();
  return json;
}

export async function delete_task(key) {
  const requestOptions = {
    method: "DELETE",
    headers: { "Content-Type": "application/json", "Authorization": "Token " + localStorage.getItem('token') },
  };
  await fetch(`/api/tasks/${key}/`, requestOptions);
}

export async function edit_partner(key, partner) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "Authorization": "Token " + localStorage.getItem('token') },
    body: JSON.stringify(partner),
  };
  const response = await fetch(`/api/partners/${key}/`, requestOptions);
  const json = await response.json();
  return json;
}

export async function add_partner(partner) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Token " + localStorage.getItem('token') },
    body: JSON.stringify(partner),
  };
  const response = await fetch(`/api/partners/`, requestOptions);
  const json = await response.json();
  return json;
}

export async function add_analysis(analysis) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Token " + localStorage.getItem('token') },
    body: JSON.stringify(analysis),
  };
  const response = await fetch(`/api/analyses/`, requestOptions);
  const json = await response.json();
  return json;
}

export async function get_analysis(key, code) {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  const response = await fetch(`/api/analyses/${key}?code=${code}`, requestOptions);
  if (response.status !== 403) {
    const json = await response.json();
    return json;
  }
}

export async function get_analyses(partner) {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json", "Authorization": "Token " + localStorage.getItem('token') },
  };
  console.log(partner);
  const response = await fetch('/api/analyses?' + new URLSearchParams({partner: partner}), requestOptions);
  if (response.status !== 403) {
    const json = await response.json();
    return json;
  }
}

export async function edit_analysis(analysis) {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(analysis),
  };
  const response = await fetch(`/api/analyses/${analysis.id}/`, requestOptions);
  const json = await response.json();
  return json;
}

export async function get_notifications() {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json", "Authorization": "Token " + localStorage.getItem('token') },
  };
  const response = await fetch('/api/notifications/', requestOptions);
  if (response.status !== 403) {
    const json = await response.json();
    return json;
  }
}

export async function mark_as_seen() {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "Authorization": "Token " + localStorage.getItem('token') },
  };
  const response = await fetch('/api/notifications_checked/', requestOptions);
  if (response.status !== 403) {
    const json = await response.json();
    return json;
  }
}

export async function get_templates(partner) {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json", "Authorization": "Token " + localStorage.getItem('token') },
  };
  console.log(partner);
  const response = await fetch('/api/analyses/get_templates/', requestOptions);
  if (response.status !== 403) {
    const json = await response.json();
    return json;
  }
}