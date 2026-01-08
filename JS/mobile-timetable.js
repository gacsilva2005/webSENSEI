document.addEventListener('DOMContentLoaded', function() {
    const accordionHeaders = document.querySelectorAll('.day-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // Fecha todos os outros itens do acordeão
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header) {
                    otherHeader.classList.remove('active');
                    const otherContent = otherHeader.nextElementSibling;
                    otherContent.classList.remove('active');
                }
            });
            
            // Alterna o item clicado
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            content.classList.toggle('active');
        });
    });
    
    // Abre o primeiro item por padrão em mobile
    if (window.innerWidth <= 768) {
        const firstHeader = document.querySelector('.day-header');
        if (firstHeader) {
            firstHeader.classList.add('active');
            const firstContent = firstHeader.nextElementSibling;
            firstContent.classList.add('active');
        }
    }
});