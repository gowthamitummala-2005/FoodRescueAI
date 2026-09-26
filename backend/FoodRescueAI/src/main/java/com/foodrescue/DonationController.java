package com.foodrescue;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "https://foodrescueai.netlify.app")
public class DonationController {

    @Autowired
    private DonationRepository donationRepository;

    // Add Donation
    @PostMapping
    public Donation addDonation(@RequestBody Donation donation) {

        donation.setStatus("Pending");

        return donationRepository.save(donation);

    }

    // Get All Donations
    @GetMapping
    public List<Donation> getAllDonations() {

        return donationRepository.findAll();

    }

    // Get Donations By User
    @GetMapping("/user/{donorName}")
    public List<Donation> getDonationsByUser(
            @PathVariable String donorName) {

        return donationRepository.findByDonorName(donorName);

    }

    // Get Donation By Id
    @GetMapping("/{id}")
    public Donation getDonation(
            @PathVariable Long id) {

        return donationRepository.findById(id).orElse(null);

    }

    // Update Donation
    @PutMapping("/{id}")
    public Donation updateDonation(
            @PathVariable Long id,
            @RequestBody Donation updatedDonation) {

        Donation donation =
                donationRepository.findById(id).orElse(null);

        if (donation == null) {

            return null;

        }

        donation.setFoodName(updatedDonation.getFoodName());
        donation.setQuantity(updatedDonation.getQuantity());
        donation.setPickupAddress(updatedDonation.getPickupAddress());
        donation.setDonorName(updatedDonation.getDonorName());
        donation.setStatus(updatedDonation.getStatus());

        return donationRepository.save(donation);

    }

    // Delete Donation
    @DeleteMapping("/{id}")
    public String deleteDonation(
            @PathVariable Long id) {

        donationRepository.deleteById(id);

        return "Donation Deleted Successfully";

    }

}