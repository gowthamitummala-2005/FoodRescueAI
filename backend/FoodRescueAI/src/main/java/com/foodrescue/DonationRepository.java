package com.foodrescue;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DonationRepository extends JpaRepository<Donation, Long> {

    List<Donation> findByDonorName(String donorName);

}