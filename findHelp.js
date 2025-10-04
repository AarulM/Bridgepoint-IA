document.addEventListener("DOMContentLoaded", function () {
const apiKey = "AIzaSyBxd1msfLAIJORFTSIu0wsqOl8aL9w5Snw"; // GOOGLE API KEY EMBEDDED TO THE SCRIPT FOR DEMONSTRATION PURPOSES ONLY.
    /* This script populates a dropdown with organizations that provide help for homelessness and related issues.*/
    /*When an organization is selected, it updates the displayed information and the map.*/
    /* The organizations are hardcoded in an array for demonstration purposes.*/
    /* The map is displayed using an iframe with a Google Maps embed link.*/
    /* The script also includes a function to update the organization details based on the selected option in the dropdown.*/
    /* The dropdown is populated with the names of the organizations, and when an organization is selected, its details are displayed in the respective HTML elements.*/
    /* The map iframe source is also updated to show the location of the selected organization.*/
    /* The script is executed when the DOM content is fully loaded to ensure all elements are available for manipulation.*/ 
    /* The organizations array contains objects with details about each organization, including name, address, services offered, help provided, website link, and map URL.*/
    /* The organizationns are real and exist in the Seattle area, providing various services to help individuals experiencing homelessness and related issues.*/
    /* The map URLs are Google Maps embed links that display the location of each organization on a map.*/
    const organizations = [
        {
            name: "Seattle Homeless Outreach - Non Profit Organization",
            address: "12345 Lake City Way NE, #177 Seattle, WA 98125 USA",
            services: "Food distribution, temporary shelter, hygiene kits, clothing assistance, and job search support.",
            help: "Seattle Homeless Outreach provides immediate relief by distributing warm meals, clean clothing, and essential hygiene kits to those experiencing homelessness.",
            website: "https://seattlehomeless.org",
            mapUrl: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d10761.405491471223!2d-122.313756!3d47.599857!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54906abf87de4ad7%3A0x3f26dae79363b5f4!2s302%2014th%20Ave%20S%2C%20Seattle%2C%20WA%2098144!5e0!3m2!1sen!2sus!4v1742111571286!5m2!1sen!2sus"
        },
        {
            name: "Mary's Place - Non Profit Organization",
            address: "100 23rd Ave S, Seattle, WA 98144 USA",
            services: "Emergency shelter, housing navigation, employment training, childcare services, and family support programs.",
            help: "Mary's Place offers safe, temporary housing for women, children, and families experiencing homelessness.",
            website: "https://www.marysplaceseattle.org",
            mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2696.139117677197!2d-122.35381532366334!3d47.48720317117908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54904328fd3a7121%3A0x9d3596b32603e7f9!2sMary's%20Place!5e0!3m2!1sen!2sus!4v1742109922202!5m2!1sen!2sus"

        },
        {
            name: "King County Regional Homelessness Authority (KCRHA) - Non Profit Organization",
            address: "700 5th Ave, Suite 2300, Seattle, WA 98104 USA",
            services: "Coordinated entry for housing, outreach and engagement, policy advocacy, and mental health support.",
            help: "KCRHA works to unify and improve homelessness response efforts across King County by providing streamlined access to housing resources.",
            website: "https://www.kcrha.org",
            mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5380.48425784394!2d-122.3282071!3d47.60198140000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54906aba49d1dc51%3A0xc7796d11c38c8fdd!2s400%20Yesler%20Wy%20%23600%2C%20Seattle%2C%20WA%2098104!5e0!3m2!1sen!2sus!4v1742111731627!5m2!1sen!2sus"
        },
        {
            name: "Department of Corrections Washington State - Non Profit Organization",
            address: "7345 Linderson Way SW, Tumwater, WA 98501 USA",
            services: "Reentry support, housing assistance, job training programs, and mental health services for individuals transitioning from incarceration.",
            help: "The Washington State Department of Corrections provides resources and support to help individuals reintegrate into society after incarceration, including housing assistance and job training.",
            website: "https://doc.wa.gov",
            mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2721.994621412295!2d-122.92177122369228!3d46.981440271139306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x549173fd5b4bd1b1%3A0x134a8bdc9af8df05!2sWashington%20State%20Department%20of%20Corrections%20Headquarters!5e0!3m2!1sen!2sus!4v1742612686766!5m2!1sen!2sus"
        },
        {
            name: "Valley Cities - Non Profit Organization",
            address: "325 W Gowe St, Kent, WA 98032 USA",
            services: "Mental health services, substance use treatment, housing assistance, and employment support.",
            help: "Valley Cities provides comprehensive mental health and substance use treatment services, as well as housing and employment support for individuals in need.",
            website: "https://valleycities.org/service/substance-use-disorder-treatment/",
            mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2701.582126500708!2d-122.2385188236694!3d47.38107377117009!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54905956171e8307%3A0x1ea0e56830f184ca!2sValley%20Cities%20Behavioral%20Health%20Care!5e0!3m2!1sen!2sus!4v1742617818520!5m2!1sen!2sus"
        },
        {
            name: "Coordinated Care Health- Non Profit Organization",
            address: "1145 Broadway STE 300, Tacoma, WA 98402 USA",
            services: "Health insurance, care coordination, behavioral health services, and social support.",
            help: "Coordinated Care provides health insurance and care coordination services to help individuals access necessary medical and behavioral health resources.",
            website: "https://www.coordinatedcarehealth.com/members/foster-care/mental-health.html",
            mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2708.2172548396475!2d-122.4421406236768!3d47.25145487115947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54905500633a171f%3A0x7c4f58e9e56214dc!2sAmbetter%20From%20Coordinated%20Care!5e0!3m2!1sen!2sus!4v1742621584666!5m2!1sen!2sus"
        }

    ];
    

    // Create the dropdown with organization names
    const dropdown = document.getElementById("organization-select");
    organizations.forEach((org, index) => {
        let option = document.createElement("option");
        option.value = index;
        option.textContent = org.name;
        dropdown.appendChild(option);
    });

    // update the organization details when the dropdown selection changes
    window.updateOrganizationDetails = function () {
        const selectedIndex = dropdown.value;
        if (selectedIndex === "") return;
        // Update the displayed organization details
         // and the map iframe source
         // The selectedIndex is used to access the corresponding organization object from the organizations array.
        const selectedOrg = organizations[selectedIndex];
        document.getElementById("org-name").textContent = selectedOrg.name;
        document.getElementById("org-address").textContent = selectedOrg.address;
        document.getElementById("org-services").textContent = selectedOrg.services;
        document.getElementById("org-help").textContent = selectedOrg.help;
        // Add website link - make it clickable if available
        if (selectedOrg.website) {
            document.getElementById("org-website").innerHTML = `<a href="${selectedOrg.website}" target="_blank">${selectedOrg.website}</a>`;
        } else {
            document.getElementById("org-website").textContent = "Not available";
        }
        document.getElementById("mapFrame").src = selectedOrg.mapUrl;
    };
});