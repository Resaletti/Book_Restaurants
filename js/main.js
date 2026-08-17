document.addEventListener("DOMContentLoaded", async () => {

    loadName();

    const ok = initSupabase();

    if (ok) {

        await loadPlaces();

        subscribeRealtime();

    }

    setupEvents();

});
