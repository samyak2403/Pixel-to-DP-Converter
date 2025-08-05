document.addEventListener('DOMContentLoaded', function() {
    const pxInput = document.getElementById('pxValue');
    const dpInput = document.getElementById('dpValue');
    const dprSpan = document.getElementById('dpr');
    const cssOutput = document.getElementById('cssOutput');
    const dpVisual = document.getElementById('dpVisual');
    const dpBox = document.querySelector('.dp-box');
    
    // Get device pixel ratio
    const devicePixelRatio = window.devicePixelRatio || 1;
    dprSpan.textContent = devicePixelRatio.toFixed(2);
    
    function convertPxToDp() {
        const pxValue = parseFloat(pxInput.value) || 0;
        const dpValue = pxValue / devicePixelRatio;
        
        dpInput.value = dpValue.toFixed(2);
        dpVisual.textContent = `${dpValue.toFixed(2)}dp`;
        dpBox.style.width = `${dpValue}px`;
        
        // Generate responsive CSS recommendation
        cssOutput.textContent = `width: ${pxValue}px; /* or ${dpValue.toFixed(2)}dp */`;
    }
    
    // Initial conversion
    convertPxToDp();
    
    // Update on input change
    pxInput.addEventListener('input', convertPxToDp);
    
    // Update on window resize (in case DPR changes)
    window.addEventListener('resize', function() {
        const newDpr = window.devicePixelRatio || 1;
        if (newDpr !== devicePixelRatio) {
            dprSpan.textContent = newDpr.toFixed(2);
            convertPxToDp();
        }
    });
});