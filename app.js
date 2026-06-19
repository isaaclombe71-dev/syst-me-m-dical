function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    document.getElementById(pageId).classList.add("active");
}

/* ================= HORLOGE ================= */
function horloge() {
    const maintenant = new Date();

    document.getElementById("dateActuelle").innerHTML =
        maintenant.toLocaleDateString("fr-FR");

    document.getElementById("heureActuelle").innerHTML =
        maintenant.toLocaleTimeString("fr-FR");
}

setInterval(horloge, 1000);
horloge();

/* ================= DONNEES ================= */
let patients = JSON.parse(localStorage.getItem("patients")) || [];
let editIndex = -1;

/* ================= SAUVEGARDE ================= */
function sauvegarderPatients() {
    localStorage.setItem("patients", JSON.stringify(patients));
}

/* ================= AFFICHAGE ================= */
function afficherPatients() {
    const table = document.getElementById("patientsTable");
    table.innerHTML = "";

    patients.forEach((patient, index) => {

        const sexeBadge =
            patient.sexe === "Homme"
                ? '<span class="badge-homme">Homme</span>'
                : '<span class="badge-femme">Femme</span>';

        table.innerHTML += `
        <tr>
            <td>${patient.nom}</td>
            <td>${patient.age}</td>
            <td>${sexeBadge}</td>
            <td>${patient.maladie}</td>
            <td>${patient.date}</td>
            <td>
                <button class="btn-edit" onclick="modifierPatient(${index})">
                    Modifier
                </button>

                <button class="btn-delete" onclick="supprimerPatient(${index})">
                    Supprimer
                </button>
            </td>
        </tr>
        `;
    });

    updateStats();
}

/* ================= AJOUT PATIENT ================= */
document.getElementById("patientForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const patient = {
        nom: document.getElementById("nom").value,
        age: document.getElementById("age").value,
        sexe: document.getElementById("sexe").value,
        maladie: document.getElementById("maladie").value,
        date: document.getElementById("date").value
    };

    if (editIndex === -1) {
        patients.push(patient);
        showToast("Patient ajouté avec succès ✅");
    } else {
        patients[editIndex] = patient;
        editIndex = -1;
        showToast("Patient modifié avec succès ✏️");
    }

    sauvegarderPatients();
    afficherPatients();

    this.reset();
    showPage("patients");
});

/* ================= SUPPRESSION ================= */
function supprimerPatient(index) {
    if (confirm("Supprimer ce patient ?")) {
        patients.splice(index, 1);
        sauvegarderPatients();
        afficherPatients();
        showToast("Patient supprimé ❌");
    }
}

/* ================= MODIFICATION ================= */
function modifierPatient(index) {
    const p = patients[index];

    document.getElementById("nom").value = p.nom;
    document.getElementById("age").value = p.age;
    document.getElementById("sexe").value = p.sexe;
    document.getElementById("maladie").value = p.maladie;
    document.getElementById("date").value = p.date;

    editIndex = index;
    showPage("enregistrement");
}

/* ================= RECHERCHE ================= */
document.getElementById("searchInput").addEventListener("keyup", function () {
    const valeur = this.value.toLowerCase();

    const lignes = document.querySelectorAll("#patientsTable tr");

    lignes.forEach(ligne => {
        ligne.style.display = ligne.innerText.toLowerCase().includes(valeur)
            ? ""
            : "none";
    });
});

/* ================= TOAST ================= */
function showToast(message) {
    const toast = document.getElementById("toast");

    toast.innerHTML = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

/* ================= DARK MODE ================= */
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

/* ================= STATISTIQUES ================= */
function updateStats() {
    document.getElementById("totalPatients").textContent = patients.length;

    document.getElementById("totalHommes").textContent =
        patients.filter(p => p.sexe === "Homme").length;

    document.getElementById("totalFemmes").textContent =
        patients.filter(p => p.sexe === "Femme").length;

    document.getElementById("patientsJour").textContent = patients.length;
}

/* ================= INIT ================= */
afficherPatients();
updateStats();