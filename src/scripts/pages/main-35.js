/*
    *  -----------------------------------------------------------  *
    *  -----  main-35.js  --  /src/scripts/pages/main-35.js  -----  *
    *  -----------------------------------------------------------  *
*/


(() => {


    console.log("\n");
    console.warn("-----  Proyecto 35 JS  -----");
    console.log("\n");


    /*
        *  ---------------------------------  *
        *  -----  Referencias al HTML  -----  *
        *  ---------------------------------  *
    */

    /** @type {HTMLElement | null} - `demo del widget del curso` */
    const $demo = /** @type {HTMLElement | null} */ (
        document.querySelector(".demo__course")
    );


    //  -----  validamos que exista la demo  -----
    if (!$demo) {
        throw new Error("No se ha encontrado la demo del curso.");
    }


    /** @type {HTMLHeadingElement | null} - `título con efecto de escritura` */
    const $title = /** @type {HTMLHeadingElement | null} */ (
        $demo.querySelector(".card__title")
    );

    /** @type {HTMLSpanElement | null} - `texto visible del título` */
    const $typed = /** @type {HTMLSpanElement | null} */ (
        $demo.querySelector(".title__typed")
    );


    //  -----  validamos que existan el título y el texto visible  -----
    if (!$title || !$typed) {
        throw new Error("No se ha encontrado el título del curso.");
    }


    /*
        *  -----------------------  *
        *  -----  Variables  -----  *
        *  -----------------------  *
    */

    /** - `texto completo del título` */
    const texto = $title.dataset.texto ?? "";

    /** - `final del recorte del texto` */
    let letraFin = 1;

    /** - `intervalo entre cada letra en milisegundos` */
    const velocidad = 150;

    /** - `pausa al completar el título, en milisegundos` */
    const pausa = 900;

    /** @type {number | null} - `identificador del intervalo de escritura` */
    let intervalId = null;

    /** @type {number | null} - `identificador de la pausa antes de reiniciar` */
    let timeoutId = null;


    //  -----  validamos que el título tenga texto  -----
    if (!texto) {
        throw new Error("No se ha encontrado el texto del título.");
    }


    /*
        *  -----------------------  *
        *  -----  Funciones  -----  *
        *  -----------------------  *
    */

    /**
     * --------------------------------
     * -----  `escribirTitulo()`  -----
     * --------------------------------
     * - Muestra el título letra a letra y vuelve a empezar al terminar.
     * @return {void}
     */
    const escribirTitulo = () => {

        //  -----  evitar intervalos duplicados  -----
        if (intervalId !== null) {
            window.clearInterval(intervalId);
            intervalId = null;
        }

        intervalId = window.setInterval(() => {

            $typed.textContent = texto.slice(0, letraFin);

            //  -----  si aún faltan letras, avanzar  -----
            if (letraFin < texto.length) {
                letraFin++;
                return;
            }

            //  -----  al completar, pausar y volver a empezar  -----
            if (intervalId !== null) {
                window.clearInterval(intervalId);
                intervalId = null;
            }

            timeoutId = window.setTimeout(() => {
                letraFin = 1;
                escribirTitulo();
            }, pausa);

        }, velocidad);
    };


    /*
        *  ---------------------  *
        *  -----  Eventos  -----  *
        *  ---------------------  *
    */

    //  -----  iniciar el efecto de escritura al cargar la demo  -----
    escribirTitulo();


})();
