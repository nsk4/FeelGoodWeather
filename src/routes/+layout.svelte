<script lang="ts">
</script>

<div class="content">
    <header>
        <h1>Welcome to Feel Good Weather!</h1>
        <p>Make yourself feel good by flexing over rainier places than yours.</p>
    </header>

    <main>
        <slot />
    </main>

    <footer>
        <p>
            &copy; 2024 Nejc Smrkolj Koželj. All rights reserved. (<a
                href="https://github.com/nsk4/FeelGoodWeather/blob/main/LICENSE">MIT License</a
            >)
        </p>
        <p><a href="https://github.com/nsk4/FeelGoodWeather">Github</a></p>
        <p>
            <a href="https://github.com/nsk4/FeelGoodWeather/issues/new?labels=bug">Report a bug</a>
        </p>
    </footer>
</div>

<style lang="scss">
    :global(body) {
        // Set global styles
        background-color: #0d1117;
        color: #c9d1d9;
        font-family: 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
    }

    .content {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        min-width: 320px;
        gap: 20px;

        header {
            text-align: center;
            border-bottom: 1px solid #30363d;
            h1 {
                margin: 0;
                padding: 10px;
            }
            p {
                margin: 0;
                padding: 10px;
            }
        }

        main {
            // For flex display of main content elements
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
        }

        footer {
            text-align: center;
            border-top: 1px solid #30363d;
            margin-top: auto;
            height: 3rem;

            // For flex display of footer content elements
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: 20px;

            a {
                color: #0366d6;
                text-decoration: none;
                transition: color 0.2s ease;

                &:hover {
                    color: #1f6feb;
                }

                &:active {
                    color: #0c7d9d;
                }
            }
        }
    }
</style>
