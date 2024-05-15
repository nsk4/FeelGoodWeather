<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import Fuse from 'fuse.js';

    const dispatch = createEventDispatcher();
    export let minLimit: number = 3;
    export let displayLimit: number = 10;
    export let suggestions: string[] = [];
    export let value: string = '';

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

<div class="combobox" bind:this={input}>
    <!-- TODO: isFocused is not set if user clicks on the input box too fast when page is still loading. -->
    <input
        type="text"
        bind:value
        placeholder="Type to filter..."
        on:focus={() => (isFocused = true)}
    />
    {#if isFocused && showSuggestions}
        <ul>
            {#each filteredSuggestions as suggestion (suggestion)}
                <li><button on:click={() => selectSuggestion(suggestion)}>{suggestion}</button></li>
            {/each}
        </ul>
    {/if}
</div>

<style lang="scss">
    .combobox {
        position: relative;
        display: inline-block;

        ul {
            position: absolute;
            z-index: 1;
            width: 100%;
            margin: 0;
            padding: 0;
            list-style-type: none;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-top: none;

            button:hover {
                background-color: #f1f1f1;
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
            }
        }
    }
</style>
