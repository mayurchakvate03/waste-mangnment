
    
        // Animate stats when scrolled into view
        window.addEventListener('scroll', function() {
            const statItems = document.querySelectorAll('.stat-item');
            statItems.forEach(item => {
                const position = item.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.3;
                
                if(position < screenPosition) {
                    item.classList.add('animated');
                }
            });
            
            // Navbar background change on scroll
            const navbar = document.querySelector('.navbar');
            if(window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
        
        // Animate waste level on service card hover
        const wasteBins = document.querySelectorAll('.waste-level');
        wasteBins.forEach(bin => {
            bin.parentElement.addEventListener('mouseenter', function() {
                bin.style.height = '40%';
            });
            bin.parentElement.addEventListener('mouseleave', function() {
                bin.style.height = '70%';
            });
        });
        
        // Random animation delays for stats
        document.querySelectorAll('.stat-item').forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.2}s`;
        });
    



    
        // Map Modal Functions
        function showMapModal() {
            document.getElementById('map-modal').classList.remove('hidden');
            initReportMap();
        }

        function closeMapModal() {
            document.getElementById('map-modal').classList.add('hidden');
        }

        function initReportMap() {
            // This would initialize a map with Leaflet or Google Maps
            console.log("Map would be initialized here");
        }

        function previewImages(input) {
            const previewContainer = document.createElement('div');
            previewContainer.className = 'flex flex-wrap gap-2 mt-2';
            
            // Clear previous previews
            const existingPreviews = document.querySelector('.image-preview-container');
            if (existingPreviews) existingPreviews.remove();
            
            if (input.files && input.files.length > 0) {
                for (let i = 0; i < input.files.length; i++) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.className = 'h-20 w-20 object-cover rounded border';
                        previewContainer.appendChild(img);
                    }
                    reader.readAsDataURL(input.files[i]);
                }
                input.parentNode.insertBefore(previewContainer, input.nextSibling);
                previewContainer.classList.add('image-preview-container');
            }
        }

        function setLocationFromMap() {
            // This would get the selected location from the map
            document.getElementById('location').value = "Latitude: 28.6139, Longitude: 77.2090"; // Delhi coordinates as example
            closeMapModal();
        }

        // Form Submission with Image Handling
        document.getElementById('waste-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submit-btn');
            submitBtn.disabled = true;
            submitBtn.innerText = 'Submitting...';
            
            const formData = new FormData();
            const photoInput = document.getElementById('waste-photos');
            
            // Add all selected files to FormData
            for (let i = 0; i < photoInput.files.length; i++) {
                formData.append('images', photoInput.files[i]);
            }
            
            // Add other form data
            formData.append('location', document.getElementById('location').value);
            formData.append('wasteType', document.getElementById('waste-type').value);
            formData.append('notes', document.getElementById('notes').value);
            
            // Example API call to backend
            fetch('/api/report-waste', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Show success message
                const successMsg = document.createElement('div');
                successMsg.className = 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4';
                successMsg.innerHTML = `
                    <strong class="font-bold">Success!</strong>
                    <span class="block sm:inline">Thank you for reporting the waste. Your image has been submitted successfully.</span>
                    <span class="block sm:inline">You earned ${data.rewardPoints || 0} reward points!</span>
                `;
                this.parentNode.insertBefore(successMsg, this.nextSibling);
                
                this.reset();
                submitBtn.disabled = false;
                submitBtn.innerText = 'Submit Report & Earn Rewards';
                
                // Remove preview images
                const preview = document.querySelector('.image-preview-container');
                if (preview) preview.remove();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Submission failed. Please try again.');
                submitBtn.disabled = false;
                submitBtn.innerText = 'Submit Report & Earn Rewards';
            });
        });
    