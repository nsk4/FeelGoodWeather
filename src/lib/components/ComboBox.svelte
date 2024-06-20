<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import Fuse from 'fuse.js';

    const dispatch = createEventDispatcher();
    export let minLimit: number = 3;
    export let displayLimit: number = 10;
    export let suggestions: string[] = [];
    export let value: string = '';
    export let width: string = '';

    let filteredSuggestions: string[] = [];
    let isFocused: boolean = false;
    let showSuggestions: boolean = false;

    // Initialize fussy text search with suggestions. Reinitialize it every time suggestions change.
    $: fuse = new Fuse(suggestions, { threshold: 0.35 });

    // Filter suggestions based on user input only if user entered enough characters
    $: if (value.length >= minLimit) {
        filteredSuggestions = fuse
            .search(value)
            .slice(0, displayLimit)
            .map((result) => result.item);
    }

    // Show/hide suggestions based on user input
    $: showSuggestions = value.length >= minLimit && filteredSuggestions.length > 0;

    // Update input field with selected suggestion
    function selectSuggestion(suggestion: string): void {
        value = suggestion;
        isFocused = false;
        dispatch('selected', { text: value });
    }

    // Close suggestions when clicking outside the combobox
    function handleClickOutside(event: MouseEvent): void {
        if (input && !input.contains(event.target as Node)) {
            isFocused = false;
        }
    }

    // Add event listener for detecting clicks outside this component
    let input: HTMLDivElement;
    onMount(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    });
</script>

<div class="combobox" bind:this={input} style:width>
    <input
        type="text"
        bind:value
        placeholder="Type to filter..."
        on:focus={() => (isFocused = true)}
        on:change={() => (isFocused = true)}
        class="input-box"
    />

    <input type="button" class="clear-input-button" value="X" on:click={() => (value = '')} />

    {#if isFocused && showSuggestions}
        <ul>
            {#each filteredSuggestions as suggestion}
                <li><button on:click={() => selectSuggestion(suggestion)}>{suggestion}</button></li>
            {/each}
        </ul>
    {/if}
</div>

<style lang="scss">
    .combobox {
        position: relative;
        display: inline-block;
        width: 100%;

        .input-box {
            background-color: #0d1117;
            color: #c9d1d9;
            font-family: 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji',
                'Segoe UI Emoji';
            border: 1px solid #30363d;
            border-radius: 6px;
            padding: 8px;
            box-sizing: border-box;
            width: 100%;
        }

        .clear-input-button {
            position: absolute;
            background: none;
            border: none;
            cursor: pointer;
            right: 0;
            top: 0;
            bottom: 0;
            color: #c9d1d9;
            font-family: 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji',
                'Segoe UI Emoji';
        }

        ul {
            position: absolute;
            z-index: 1;
            width: 100%;
            margin: 0;
            list-style-type: none;
            background-color: #161b22;
            border: 1px solid #30363d;
            border-top: none;
            border-radius: 6px;
            padding: 8px;
            box-sizing: border-box;

            button:hover {
                background-color: #30363d;
            }

            button {
                background: none;
                border: none;
                padding: 8px 12px;
                font: inherit;
                cursor: pointer;
                text-align: left;
                width: 100%;
                display: flex;
                align-items: center;
                color: #c9d1d9;
            }
        }
    }
</style>
