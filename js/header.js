class Header extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <p>
                <a href="../index.html">Homepage</a>
                <a href="wiki.html">Wiki</a>
                <a href="klangkinetik.html">KlangKinetik</a>
            </p>
        `
    }
}

customElements.define('header-container', Header)