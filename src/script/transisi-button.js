document.addEventListener("DOMContentLoaded", function() {
    var exploreBtn = document.querySelector('.btn');
    exploreBtn.addEventListener('click', function(e) {
        e.preventDefault();
        var targetElement = document.getElementById('content');
        smoothScroll(targetElement);
    });

    function smoothScroll(target) {
        var targetPosition = target.getBoundingClientRect().top;
        var startPosition = window.pageYOffset || window.scrollY;
        var distance = targetPosition - startPosition;
        var duration = 250;
        var start = null;

        window.requestAnimationFrame(step);

        function step(timestamp) {
            if (!start) start = timestamp;
            var progress = timestamp - start;
            window.scrollTo(0, easeInOutCubic(progress, startPosition, distance, duration));
            if (progress < duration) window.requestAnimationFrame(step);
        }

        function easeInOutCubic(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        }
    }
});