/*
    *  -----------------------------------------------------------  *
    *  -----  main-36.js  --  /src/scripts/pages/main-36.js  -----  *
    *  -----------------------------------------------------------  *
*/



(() => {


    console.log("\n");
    console.warn("-----  Proyecto 36 JS  -----");
    console.log("\n");


    /**
     * -----------------------
     * -----  `Nota {}`  -----
     * -----------------------
     * @typedef {Object} Nota
     * @property {string} title - Título de la nota.
     * @property {string} body - Cuerpo de la nota.
     */

    /*
        *  ---------------------------------  *
        *  -----  Referencias al HTML  -----  *
        *  ---------------------------------  *
    */

    /** @type {HTMLSectionElement | null} - `Contenedor de la demo de notas` */
    const $notesDemo = document.querySelector(".demo__notes");

    /** @type {HTMLButtonElement | null} - `Botón para añadir una nota` */
    const $btn = $notesDemo ? $notesDemo.querySelector(".actions__btn") : null;

    /** @type {HTMLSectionElement | null} - `Listado de notas` */
    const $notes = $notesDemo ? $notesDemo.querySelector(".notes__list") : null;


    //  -----  verificación de elementos  -----
    if (!$notesDemo || !$btn || !$notes) {
        throw new Error("No se han encontrado los elementos necesarios en el HTML.");
    }


    /** - `clave de localstorage para las notas` */
    const CLAVE_STORAGE = "notes";


    /**
     * ---------------------------------------------------
     * -----  `createNote(title, body, transition)`  -----
     * ---------------------------------------------------
     * - Crea una nota en el DOM y la añade al listado.
     * @param {string} [title=""] - Título de la nota.
     * @param {string} [body=""] - Cuerpo de la nota.
     * @param {boolean} [transition=true] - Si debe animarse al aparecer.
     * @return {void}
     */
    const createNote = (title = "", body = "", transition = true) => {

        /** @type {HTMLArticleElement} - `artículo de la nota` */
        const $note = document.createElement("article");
        
        $note.classList.add("list__note");


        //  -----  animaciones de aparición de las notas  -----
        if (transition) {
            setTimeout(() => $note.classList.add("list__note--visible"), 10);
        }
        else {
            $note.classList.add("list__note--visible-no-transition");
        }


        //  -----  header de la nota  -----
        
        /** @type {HTMLHeaderElement} - `cabecera de la nota` */
        const $header = document.createElement("header");
        
        $header.classList.add("note__header");


        //  -----  input del header  -----
        
        /** @type {HTMLInputElement} - `campo del título` */
        const $input = document.createElement("input");
        
        $input.type = "text";
        $input.classList.add("header__input");
        $input.value = title;

        //  -----  botón eliminar del header  -----
        
        /** @type {HTMLButtonElement} - `botón de eliminar nota` */
        const $deleteBtn = document.createElement("button");
        
        $deleteBtn.type = "button";
        $deleteBtn.classList.add("header__delete");
        $deleteBtn.setAttribute("aria-label", "Eliminar nota");

        /** @type {HTMLElement} - `icono de la papelera` */
        const $icon = document.createElement("i");
        
        $icon.classList.add("delete__icon", "fa-solid", "fa-trash");
        $icon.setAttribute("aria-hidden", "true");

        //  -----  añadir icono a la papelera  -----
        $deleteBtn.appendChild($icon);

        //  -----  añadir hijos al header  -----
        $header.appendChild($input);
        $header.appendChild($deleteBtn);


        //  -----  cuerpo de la nota  -----
        
        /** @type {HTMLTextAreaElement} - `campo del cuerpo` */
        const $textarea = document.createElement("textarea");
        
        $textarea.classList.add("note__body");
        $textarea.name = "body";
        $textarea.value = body;


        //  -----  añadir hijos a la nota  -----
        
        $note.appendChild($header);
        $note.appendChild($textarea);
        $notes.appendChild($note);

        //  -----  Evento para escribir datos  -----
        
        $input.addEventListener("input", update);
        $textarea.addEventListener("input", update);

        //  -----  Evento para eliminar nota  -----
        $deleteBtn.addEventListener("click", (event) => {

            event.preventDefault();

            //  -----  animaciones de desaparición de la nota  -----
            $note.classList.remove("list__note--visible-no-transition");
            
            //  -----  eliminar la animación de aparición de la nota  -----
            $note.classList.remove("list__note--visible");

            //  -----  eliminar la nota del DOM  -----
            setTimeout(() => {
                $note.remove();
                update();
            }, 100);

        });
    };


    /**
     * ------------------------
     * -----  `update()`  -----
     * ------------------------
     * - Recoge las notas del DOM y las guarda en localStorage.
     * @return {void}
     */
    const update = () => {

        /** @type {Nota[]} - `notas a persistir` */
        const arrNotes = [];

        /** @type {NodeListOf<HTMLArticleElement>} - `notas renderizadas` */
        const $notesDom = $notes.querySelectorAll(".list__note");


        //  -----  recorrer las notas renderizadas  -----
        $notesDom.forEach(($noteDom) => {

            /** - `campo de titulo` */
            const $noteInput = /** @type {HTMLInputElement | null} */ (
                $noteDom.querySelector(".header__input")
            );

            /** - `campo de cuerpo` */
            const $noteTextarea = /** @type {HTMLTextAreaElement | null} */ (
                $noteDom.querySelector(".note__body")
            );

            //  -----  si falta algún campo, saltar la nota  -----
            if (!$noteInput || !$noteTextarea) {
                return;
            }

            /** @type {Nota} - `datos de la nota` */
            const noteInfo = {
                title: $noteInput.value,
                body: $noteTextarea.value
            };

            if (noteInfo.title.trim() !== "" || noteInfo.body.trim() !== "") {
                arrNotes.push(noteInfo);
            }
        });

        //  -----  persistir notas  -----
        console.log(arrNotes);
        localStorage.setItem(CLAVE_STORAGE, JSON.stringify(arrNotes));

    };



    /**
     * --------------------------
     * -----  `getNotes()`  -----
     * --------------------------
     * - Lee las notas de localStorage y las vuelve a pintar.
     * @return {void}
     */
    const getNotes = () => {

        /** - `contenido crudo de localstorage` */
        const bruto = localStorage.getItem(CLAVE_STORAGE);

        //  -----  si no hay datos, no hay notas que pintar  -----
        if (!bruto) {
            return;
        }

        //  -----  parsear el json de localstorage  -----
        try {

            /** @type {unknown} - `datos parseados` */
            const parseado = JSON.parse(bruto);

            //  -----  si no es un array, no pintar nada  -----
            if (!Array.isArray(parseado)) {
                return;
            }

            /** @type {Nota[]} - `notas almacenadas` */
            const notesStorage = parseado;

            notesStorage.forEach((note) => createNote(note.title, note.body, false));

        }
        
        //  -----  si el json es inválido, no pintar nada  -----
        catch {
            return;
        }

    };


    //  -----  pulsar botón crear una nota  -----
    $btn.addEventListener("click", (event) => {
        event.preventDefault();
        createNote("", "");
    });


    //  -----  al iniciar la aplicación  -----
    getNotes();


})();
