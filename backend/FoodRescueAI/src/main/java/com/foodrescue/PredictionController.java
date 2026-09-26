package com.foodrescue;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/predictions")
@CrossOrigin(origins = "https://foodrescueai.netlify.app")
public class PredictionController {

    @Autowired
    private PredictionRepository predictionRepository;

    // =========================================================
    // GENERATE AI PREDICTION
    // =========================================================

    @PostMapping
    public ResponseEntity<Prediction> generatePrediction(
            @RequestBody Prediction prediction) {

        int quantity = prediction.getQuantity();

        // Basic validation
        if (quantity <= 0) {
            return ResponseEntity.badRequest().build();
        }

        // -----------------------------------------------------
        // AI PREDICTION LOGIC
        // -----------------------------------------------------

        if (quantity >= 100) {

            prediction.setWasteRisk("High");

            prediction.setWasteProbability(92.0);

            prediction.setConfidence(97.5);

            prediction.setRecommendedNgo("Robin Hood Army");

            prediction.setRecommendation(
                    "Donate within 1 hour to reduce food waste."
            );

        } else if (quantity >= 50) {

            prediction.setWasteRisk("Medium");

            prediction.setWasteProbability(65.0);

            prediction.setConfidence(94.2);

            prediction.setRecommendedNgo("Feeding India");

            prediction.setRecommendation(
                    "Donate within 3 hours for better redistribution."
            );

        } else {

            prediction.setWasteRisk("Low");

            prediction.setWasteProbability(25.0);

            prediction.setConfidence(90.5);

            prediction.setRecommendedNgo("Helping Hands NGO");

            prediction.setRecommendation(
                    "Food can be stored safely or donated locally."
            );
        }

        // -----------------------------------------------------
        // IMPACT CALCULATION
        // -----------------------------------------------------

        prediction.setMealsSaved(quantity);

        double carbonSaved = quantity * 0.18;

        prediction.setCarbonSaved(
                Math.round(carbonSaved * 100.0) / 100.0
        );

        // -----------------------------------------------------
        // STATUS + TIME
        // -----------------------------------------------------

        prediction.setStatus("Completed");

        prediction.setPredictionTime(
                LocalDateTime.now().format(
                        DateTimeFormatter.ofPattern(
                                "dd-MM-yyyy HH:mm"
                        )
                )
        );

        // -----------------------------------------------------
        // SAVE TO DATABASE
        // -----------------------------------------------------

        Prediction savedPrediction =
                predictionRepository.save(prediction);

        return ResponseEntity.ok(savedPrediction);
    }


    // =========================================================
    // GET ALL PREDICTION HISTORY
    // =========================================================

    @GetMapping
    public ResponseEntity<List<Prediction>> getAllPredictions() {

        List<Prediction> predictions =
                predictionRepository.findAll();

        return ResponseEntity.ok(predictions);
    }


    // =========================================================
    // GET SINGLE PREDICTION
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<Prediction> getPrediction(
            @PathVariable Long id) {

        return predictionRepository
                .findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    // =========================================================
    // DELETE PREDICTION
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePrediction(
            @PathVariable Long id) {

        if (!predictionRepository.existsById(id)) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        predictionRepository.deleteById(id);

        return ResponseEntity.ok(
                "Prediction deleted successfully."
        );
    }
}