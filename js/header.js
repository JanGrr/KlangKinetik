class Header extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header>
                <nav>
                    <ul class="nav-links">
                        <li><a href="../index.html">Home</a></li>
                        <li><a href="klangkinetik.html">Player</a></li>
                    </ul>
                </nav>
                <a href="wiki.html"><button>Wiki</button></a>
            </header>
        `
    }
}

customElements.define('header-container', Header)