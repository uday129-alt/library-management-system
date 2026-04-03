package com.library.controller;

import com.library.dto.TransactionDto;
import com.library.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for book issue, return, and transaction tracking.
 */
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    /**
     * POST /api/transactions/issue
     * Issue a book to a user.
     * Body: { "userId": 1, "bookId": 2 }
     */
    @PostMapping("/issue")
    public ResponseEntity<TransactionDto> issueBook(
            @RequestParam Long userId,
            @RequestParam Long bookId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(transactionService.issueBook(userId, bookId));
    }

    /**
     * PUT /api/transactions/{id}/return
     * Return a book and calculate fine if overdue.
     */
    @PutMapping("/{id}/return")
    public ResponseEntity<TransactionDto> returnBook(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.returnBook(id));
    }

    /**
     * GET /api/transactions/user/{userId}
     * Get all transactions for a specific user.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TransactionDto>> getUserTransactions(@PathVariable Long userId) {
        return ResponseEntity.ok(transactionService.getUserTransactions(userId));
    }

    /**
     * GET /api/transactions — get all transactions (Admin only).
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TransactionDto>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    /**
     * GET /api/transactions/overdue — get overdue transactions (Admin only).
     */
    @GetMapping("/overdue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TransactionDto>> getOverdueTransactions() {
        return ResponseEntity.ok(transactionService.getOverdueTransactions());
    }

    /**
     * GET /api/transactions/{id} — get a single transaction.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TransactionDto> getTransaction(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getTransactionById(id));
    }
}
