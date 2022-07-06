document.getElementById("add-button").addEventListener("click", handleAdd);
document.getElementById("remove-button").addEventListener("click", handleRemove);
document.getElementById("list-button").addEventListener("click", handleList);
document.getElementById("query-button").addEventListener("click", handleQuery);


function handleAdd() {
	const addForm = document.forms["add-form"];
	const addId = addForm["add_id"].value;
	const addType = addForm["add_type"].value;
	const file = document.getElementById("courses_file");
	const xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			document.getElementById("response").innerHTML = this.responseText;
		}
	};
	xhr.open("PUT", "./dataset/" + addId + "/" + addType, true);
	const formData = new FormData();
	formData.append("file", file.files[0]);
	xhr.setRequestHeader("Content-Type", "application/x-zip-compressedx-zip-compressed");
	console.log(formData)
	xhr.send(formData);
	xhr.onload = function() {
		alert(`Status: ${xhr.status} Datasets added: ${xhr.response}`);
	};
}

function handleRemove() {
	const removeForm = document.forms["remove-form"];
	let removeId = removeForm["remove_id"].value;

	const xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			document.getElementById("response").innerHTML = this.responseText;
		}
	};

	if (removeId){
		xhr.open("DELETE", encodeURI("./dataset/" + removeId), true);
	} else{
		xhr.open("DELETE", encodeURI("./dataset/ "), true);
	}

	xhr.send()
	xhr.onload = function() {
		alert(`Status: ${xhr.status} Datasets removed: ${xhr.response}`);
	};
}

function handleList() {
	const xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			document.getElementById("response").innerHTML = this.responseText;
		}
	};
	xhr.open("GET", "./datasets", true);
	xhr.send()
	xhr.onload = function() {
		alert(`Status: ${xhr.status} Datasets added: ${xhr.response.slice(10, xhr.response.length-1)}`);
	};
}

function handleQuery() {
	const xhr = new XMLHttpRequest();
	const query = document.getElementById("query-input").value;
	xhr.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			document.getElementById("response").innerHTML = this.responseText;
		}
	};
	xhr.open("POST", "./query", true);
	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhr.send(query);
	xhr.onload = function() {
		alert(`Status: ${xhr.status}`);
		if (this.status === 200){
			document.getElementById('query-result').value = xhr.response;
		} else{
			document.getElementById('query-result').value = "Error with query";
		}

	};

}
