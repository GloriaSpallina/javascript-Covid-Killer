import './styles.scss';
import { vaccins } from './src/data';

const app = document.querySelector('#app');

// Fonction pour faire apparaitre toute la page avec tous les vaccins
function render() {
  app.innerHTML = '';
  // Creation du header avec les boutons pour classer
  const header = `
    <header>
    <div class="d-flex-wrap titre-site">
      <img src="covidkiller.png" class="img-covid"/>
      <h1>Covid Killer</h1>
      <img src="covidkiller.png" class="img-covid"/>
    </div>
    <div class="d-flex-wrap">
      <button id="classerParPrix">Classer par prix</button>
      <button class="btn-approuve">Uniquement approuvés</button>
      </div>
      </header>
  `;

  // injecter le titre et le hearder dans le HTML
  app.innerHTML += header;
  // Creation du catalogue de vaccins sous forme de carte
  let main = '<main><section class="catalogue d-flex-wrap">';
  vaccins.map((vaccin) => {
    main += `
      <div class="carteVaccin">
        <img src="${vaccin.image}" class="img-vaccin">
        <h2 class="nomVaccin">${vaccin.nom}</h2>
        <p>Inventeur(s) : ${vaccin.inventeurs.join(', ')}</p>
        <p>Lieux : ${vaccin.lieux.join(', ')}</p>
        <p>Technologie : ${vaccin.technologie}</p>
        <p>Quantité : <span class="quantite">${vaccin.quantite}</span></p>
        <p>Prix : <span class="prix">${vaccin.prix}</span> $</p>
        Approuvé : ${vaccin.approuve ? '<span>Oui</span>' : '<span class="pas-approuve">Non</span>'} <br/>
        <input type="number" name="quantiteVoulue" class="quantiteVoulue" min="0" max="${vaccin.quantite}">
        <input type="submit" value="Réserver" class="reserver" id="${vaccin.id}">
      </div>
      `;
  });

  // rajout des divs vides pour un affichage joli
  const cheat = `
    <div class="cheat"> </div>
    <div class="cheat"> </div>
  `;

  main += `${cheat}</section></main> <br/>`;

  app.innerHTML += main;

  // creation du footer
  let footer = '<footer><h2>Résumé de la commande en cours</h2>';
  footer += `
    <div>
      <p class="messageCommande">Votre panier est vide</p>
      <div class="contenuCommande"> </div>
      <div class="total"> </div>
      <div class="btn-commande">
      <button id="commander" disabled>Passer commande</button>
      <button id="supprimerPanier" disabled>Annuler la commande</button>
      </div>
    </div>
    </footer>
  `;

  app.innerHTML += footer;
}
render();

// Manipulation du DOM et Interaction utilisateur
const contenuFacture = document.querySelector('.contenuCommande');
const totalFacture = document.querySelector('.total');
document.body.addEventListener('click', (e) => {
  // afficher que les vaccins qui sont approuvés
  // remontrer tous les vaccins
  if (e.target.matches('.btn-approuve')) {
    document.querySelectorAll('.pas-approuve').forEach((np) => np.parentNode.style.display = 'none');
    e.target.innerHTML = 'Afficher tous les vaccins';
    e.target.classList.replace('btn-approuve', 'btn-all');
  } else if (e.target.matches('.btn-all')) {
    render();
  }

  // classer et afficher les vaccins par ordre de prix (du moins cher au plus cher)
  if (e.target.matches('#classerParPrix')) {
    // classer par ordre de prix tous les vaccins
    vaccins.sort((a, b) => a.prix - b.prix); // renvoie un tableau
    render();
  }

  // ajouter les vaccins dans le footer (commande)
  if (e.target.matches('.reserver')) {
    // aller chercher le nom du vaccin, la quantité, le prix et la quantité voulue par l'user
    const nomVaccinSelect = e.target.parentNode.querySelector('.nomVaccin').innerHTML;
    const reserveVaccin = Number(e.target.parentNode.querySelector('.quantite').innerHTML);
    const prix = e.target.parentNode.querySelector('.prix').innerHTML;
    const quantiteVoulue = e.target.parentNode.querySelector('.quantiteVoulue').value;
    if (quantiteVoulue > 0 && quantiteVoulue <= reserveVaccin) {
      // Changer le message de "panier vide à voici le contenur de votre commande"
      document.querySelector('.messageCommande').innerHTML = '<h3> Voici le contenu de votre panier : </h3>';
      // Ajouter le vaccin + la quantité dans le footer
      const totalLot = prix * quantiteVoulue;
      let prixTotal = 0;
      const contenuCommande = document.querySelector('.contenuCommande');
      contenuCommande.innerHTML += `
        <div class="d-flex commande">
            <div>Nom : ${nomVaccinSelect} </div>
            <div>Prix unitaire: ${prix} $</div>
            <div>Quantité : ${quantiteVoulue}</div>
            <div>Prix du lot: <span class="total-lot">${totalLot}</span> $</div>
        </div>
      `;
      document.querySelectorAll('.total-lot').forEach((tl) => prixTotal += Number(tl.innerHTML));
      const leTotal = document.querySelector('.total');
      leTotal.innerHTML = `
      <div class="d-flex commande">
          <div>Total :</div>
          <div> ${prixTotal} $</div>
      </div>
        `;
      // reactiver les boutons 'vider le panier, commander et désactiver réserver + input associé
      document.getElementById('supprimerPanier').disabled = false;
      document.getElementById('commander').disabled = false;
      e.target.disabled = true;
      e.target.parentNode.querySelector('.quantiteVoulue').disabled = true;
    } else {
      document.querySelector('.messageCommande').innerHTML += '<h3> Vous devez réserver au minimum 1 vaccin et maximum la quantité de vaccins dispo </h3>';
    }
  }

  // Quand l'user clique sur "passer la commande"
  if (e.target.matches('#commander')) {
    app.innerHTML = `
    <div class="resume-order">
      <p>La commande a bien été enregistrée...</p> 
      <div class="commande">
        ${contenuFacture.innerHTML}
        ${totalFacture.innerHTML}
      </div>
      
      <button id="annulerCommande">Annuler la commande</button>
    </div>
    `;
  }

  // permet d'annuler toute la réservation d'un coup
  if (e.target.matches('#supprimerPanier')) {
    render();
  }

  // annuler la commande quand la commande est enregistrée
  if (e.target.matches('#annulerCommande')) {
    render();
  }
});
