// ! Ay dizisi
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  
  // ! Html'den gelen elemanlar
  const addBox = document.querySelector(".add-box");
  const popupBoxContainer = document.querySelector(".popup-box");
  const popupBox = document.querySelector(".popup");
  const closeBtn = document.querySelector("header i");
  const form = document.querySelector("form");
  const wrapper = document.querySelector(".wrapper");
  const popupTitle = document.querySelector("header p");
  const submitBtn = document.querySelector("#submit-btn");
  
  // ! localstorage'dan noteları al ve eğer localde not yoksa boş bizi dönder
  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  
  // ! Güncelleme için gereken değişkenler
  let isUpdate = false;
  let updateId = null;
  
  // ! Fonksiyonlar ve olay izleyicileri
  
  // AddBox'a tıklanınca bir fonksiyon tetikle
  addBox.addEventListener("click", () => {
    // PopupboxContainer ve popupbox'a bir class ekle
    popupBoxContainer.classList.add("show");
    popupBox.classList.add("show");
    // Arka plandaki sayfa kaydırılmasını engelle
    document.querySelector("body").style.overflow = "hidden";
  });
  
  // CloseBtn'e tıklayınca popupBoxContainer ve popup'a eklenen classları kaldır
  closeBtn.addEventListener("click", () => {
    popupBoxContainer.classList.remove("show");
    popupBox.classList.remove("show");
    // Arka plandaki sayfa kaydırılmasını tekrardan aktif et
    document.querySelector("body").style.overflow = "auto";
  });
  
  // Menu kısmını ayarlayan fonksiyon
  
  function showMenu(elem) {
    // parentElement bir elemanın kapsam elemanına erişmek için kullanılır
  
    // Tıklanılan elemanın kapsamına eriştikten sonra buna bir class ekledik
    elem.parentElement.classList.add("show");
  
    // Tıklanılan yer menu kısmı haricindeyse show classını kaldır
  
    document.addEventListener("click", (e) => {
      // Tıklanılan kısım i etiketi değilse yada kapsam dışarısındaysa show classını kaldır
      if (e.target.tagName != "I" || e.target != elem) {
        elem.parentElement.classList.remove("show");
      }
    });
  }
  
  // Wrapper kısımındaki tıklanmaları izle
  wrapper.addEventListener("click", (e) => {
    // Eğer üç noktaya tıklanıldıysa
    if (e.target.classList.contains("bx-dots-horizontal-rounded")) {
      showMenu(e.target);
    }
    // Eğer sil ikonuna tıklandıldıysa
    else if (e.target.classList.contains("deleteIcon")) {
      const res = confirm("Bu notu silmek istediğinize eminmisiniz ?");
      if (res) {
        // Tıklanılan note elemanına eriş
        const note = e.target.closest(".note");
        // Notun idsine eriş
        const noteId = note.dataset.id;
        // Notes dizisini dön ve id'si noteId'ye eşit olan elemanı diziden kaldır
        notes = notes.filter((note) => note.id != noteId);
  
        // localStorage'ı güncelle
        localStorage.setItem("notes", JSON.stringify(notes));
  
        // renderNotes fonksiyonunu çalıştır
        renderNotes();
      }
    }
  
    // Eğer güncelle ikonuna tıklanıldıysa
    else if (e.target.classList.contains("updateIcon")) {
      // Tıklanılan note elemanına eriş
      const note = e.target.closest(".note");
      // Note elemanının idsine eriş
      const noteId = parseInt(note.dataset.id);
      // Note dizisi içerisinde id'si bilinen elemanı bul
      const foundedNote = notes.find((note) => note.id == noteId);
  
      // Popup içerisindeki elemanlara note değerlerini ata
      form[0].value = foundedNote.title;
      form[1].value = foundedNote.description;
  
      // Güncelleme modunu aktif et
      isUpdate = true;
      updateId = noteId;
  
      // Popup'ı aç
      popupBoxContainer.classList.add("show");
      popupBox.classList.add("show");
  
      // Popup içerisindeki gerekli alanları update e göre düzenle
      popupTitle.textContent = "Update Note";
      submitBtn.textContent = "Update";
    }
  });
  
  // Form'a bir olay izleyisi ekle ve form içerisindeki verilere eriş
  form.addEventListener("submit", (e) => {
    // Form gönderildiğinde sayfa yenilemesini engelle
    e.preventDefault();
  
    // Form içerisindeki elemanlara eriş
    let titleInput = e.target[0];
    let descriptionInput = e.target[1];
  
    // Form elemanlarının içerisindeki değerlere eriş
    let title = titleInput.value.trim();
    let description = descriptionInput.value.trim();
  
    // Eğer title ve description değeri yoksa uyarı ver
    if (!title && !description) {
      alert("Lütfen formdaki gerekli kısımları doldurunuz !");
    }
    // Eğer title ve description değeri varsa gerekli bilgileri oluştur
    const date = new Date();
    let id = new Date().getTime();
    let day = date.getDate();
    let year = date.getFullYear();
    let month = months[date.getMonth()];
  
    // Eğer güncelleme modundaysa
    if (isUpdate) {
      // Güncelleme yapılacak elemanın dizi içerisindeki indexini bul
      const noteIndex = notes.findIndex((note) => {
        return note.id == updateId;
      });
  
      // Dizi içerisinde yukarıda bulunan index'deki elemanın değerlerini güncelle
      notes[noteIndex] = {
        title,
        description,
        id,
        date: `${month} ${day},${year}`,
      };
      // Güncelleme modunu kapat ve popup içerisindeki elemanları eskiye çevir
      isUpdate = false;
      updateId = null;
      popupTitle.textContent = "New Note";
      submitBtn.textContent = "Add Note";
    } else {
      // Elde edilen verileri bir note objesi altında topla
      let noteInfo = {
        title,
        description,
        date: `${month} ${day},${year}`,
        id,
      };
      // noteInfo objesini notes dizisine ekle
      notes.push(noteInfo);
    }
  
    // notes dizisini localstorage a ekle
    localStorage.setItem("notes", JSON.stringify(notes));
  
    // Formu içerisindeki elemanları temizle
    titleInput.value = "";
    descriptionInput.value = "";
    // Popup'ı kapat
    popupBoxContainer.classList.remove("show");
    popupBox.classList.remove("show");
    // Arka plandaki sayfa kaydırılmasını tekrardan aktif et
    document.querySelector("body").style.overflow = "auto";
  
    // Not eklendikten sonra notları render et
  
    renderNotes();
  });
  
  // ! Localstorage'daki verilere göre ekrana note kartları render edeb fonksiyon
  
  function renderNotes() {
    // Eğer localstorage'da not verisi yoksa fonksiyonu durdur
    if (!notes) return;
  
    // Önce  mevcut note'ları kaldır
    document.querySelectorAll(".note").forEach((li) => li.remove());
  
    // Note dizisindeki herbir eleman için ekrana bir note kartı render et
  
    notes.forEach((note) => {
      // data-id'yi  elemanlara id vermek için kullandık
      let liTag = `<li class="note" data-id='${note.id}'>
          <div class="details">
            <p class="title">${note.title}</p>
            <p class="description">
           ${note.description}
            </p>
          </div>
       
          <div class="bottom-content">
            <span>${note.date}</span>
            <div class="settings ">
              <i class="bx bx-dots-horizontal-rounded"></i>
              <ul class="menu">
                <li class='updateIcon'><i class="bx bx-edit"></i> Düzenle</li>
                <li class='deleteIcon'><i class="bx bx-trash"></i> Sil</li>
              </ul>
            </div>
          </div>
        </li>`;
      //insertAdjacentHTML metodu belirli bir öğeyi bir Html elemanına göre sıralı şekilde eklemek için kullanılır.Bu metot hangi konuma ekleme yapılacak ve hangi eleman eklenecek bunu belirtmemizi ister
      addBox.insertAdjacentHTML("afterend", liTag);
    });
  }
  
  // Sayfa yüklendiğinde renderNotes fonksiyonunu çalıştır
  document.addEventListener("DOMContentLoaded", () => renderNotes());