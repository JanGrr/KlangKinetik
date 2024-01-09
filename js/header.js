class Header extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header>
                <a class="logo" href="../index.html">KlangKinetik</a>
                <nav>
                    <ul class="nav-links">
                        <li><a href="../index.html">Homepage</a></li>
                        <li><a href="klangkinetik.html">Player</a></li>
                    </ul>
                </nav>
                <a href="wiki.html"><button>Wiki</button></a>
            </header>
        `
    }
}

customElements.define('header-container', Header)

/*
            <p>
                <a href="../index.html">Homepage</a>
                <a href="wiki.html">Wiki</a>
                <a href="klangkinetik.html">KlangKinetik</a>
            </p>
*/