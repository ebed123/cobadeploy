document.addEventListener('DOMContentLoaded', () => {
    const skipLink = document.querySelector('.skip-to-content');
    
    skipLink.addEventListener('click', (event) => {
        event.preventDefault();
        
        const targetId = skipLink.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
            targetElement.setAttribute('tabindex', '-1');
            targetElement.focus();
        }
    });
});
