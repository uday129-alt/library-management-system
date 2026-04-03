package com.library.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

/**
 * Transaction entity tracking book issue and return operations.
 * Fine is calculated based on overdue days.
 */
@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many transactions can belong to one user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Many transactions can involve one book
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Column(nullable = false)
    private LocalDate issueDate;

    // Expected return date (typically 14 days after issue)
    @Column(nullable = false)
    private LocalDate dueDate;

    // Actual return date (null if not yet returned)
    private LocalDate returnDate;

    // Fine amount in currency units
    @Column(nullable = false)
    private Double fine;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    public enum Status {
        ISSUED, RETURNED, OVERDUE
    }
}
