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
        const pxValue = parseFloat(pxInput.value);
        
        // Only validate and convert if we have a valid number
        if (isNaN(pxValue) || pxValue < 0) {
            // Don't clear the input, just show error state
            pxInput.classList.add('error');
            dpInput.value = '';
            dpVisual.textContent = '0dp';
            dpBox.style.width = '0px';
            cssOutput.textContent = 'width: 0px;';
            return;
        }
        
        // Remove error styling if input is valid
        pxInput.classList.remove('error');
        
        // For Android DP conversion: 1dp = 1px at 160dpi
        // Standard conversion: px = dp * (dpi / 160)
        // So dp = px * (160 / dpi)
        // For web, we'll use a simplified approach based on device pixel ratio
        const dpValue = pxValue / devicePixelRatio;
        
        dpInput.value = dpValue.toFixed(2);
        dpVisual.textContent = `${dpValue.toFixed(2)}dp`;
        
        // Set the DP box width to show proportional representation
        // For visualization, we'll scale it to show the relative size
        const visualWidth = Math.min(pxValue, 400); // Cap at 400px for visualization
        dpBox.style.width = `${visualWidth}px`;
        
        // Generate responsive CSS recommendation
        cssOutput.textContent = `width: ${pxValue}px; /* or ${dpValue.toFixed(2)}dp */`;
    }
    
    // Initial conversion
    convertPxToDp();
    
    // Update on input change with debouncing
    let inputTimeout;
    pxInput.addEventListener('input', function() {
        clearTimeout(inputTimeout);
        inputTimeout = setTimeout(convertPxToDp, 300); // Wait 300ms after user stops typing
    });
    
    // Update on window resize (in case DPR changes)
    window.addEventListener('resize', function() {
        const newDpr = window.devicePixelRatio || 1;
        if (newDpr !== devicePixelRatio) {
            dprSpan.textContent = newDpr.toFixed(2);
            convertPxToDp();
        }
    });
    
    // Add keyboard navigation
    pxInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            convertPxToDp(); // Convert immediately on Enter
            dpInput.focus();
        }
    });
    
    // Add input validation with visual feedback
    pxInput.addEventListener('blur', function() {
        const value = parseFloat(this.value);
        if (isNaN(value) || value < 0) {
            this.classList.add('error');
        } else {
            this.classList.remove('error');
        }
    });
    
    // Prevent negative values
    pxInput.addEventListener('keypress', function(e) {
        if (e.key === '-' && this.value.length === 0) {
            e.preventDefault();
        }
    });
    
    // Clear error when user starts typing again
    pxInput.addEventListener('focus', function() {
        this.classList.remove('error');
    });
    
    // Click to copy functionality for DP box
    dpBox.addEventListener('click', function() {
        const dpValue = dpInput.value;
        if (dpValue && dpValue !== '') {
            // Copy to clipboard
            navigator.clipboard.writeText(dpValue).then(function() {
                // Show success feedback
                const originalText = dpVisual.textContent;
                dpVisual.textContent = 'Copied!';
                dpBox.classList.add('copied');
                
                // Reset after 2 seconds
                setTimeout(function() {
                    dpVisual.textContent = originalText;
                    dpBox.classList.remove('copied');
                }, 2000);
            }).catch(function(err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = dpValue;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                // Show success feedback
                const originalText = dpVisual.textContent;
                dpVisual.textContent = 'Copied!';
                dpBox.classList.add('copied');
                
                setTimeout(function() {
                    dpVisual.textContent = originalText;
                    dpBox.classList.remove('copied');
                }, 2000);
            });
        }
    });
    
    // Add cursor pointer to indicate clickable
    dpBox.style.cursor = 'pointer';
});