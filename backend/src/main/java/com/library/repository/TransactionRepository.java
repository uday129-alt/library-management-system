package com.library.repository;

import com.library.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repository for Transaction entity database operations.
 */
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Find all transactions for a specific user
    List<Transaction> findByUserId(Long userId);

    // Find all transactions for a specific book
    List<Transaction> findByBookId(Long bookId);

    // Find active (not yet returned) transaction for a user-book pair
    Optional<Transaction> findByUserIdAndBookIdAndStatus(Long userId, Long bookId, Transaction.Status status);

    // Find all overdue transactions
    @Query("SELECT t FROM Transaction t WHERE t.status = 'ISSUED' AND t.dueDate < CURRENT_DATE")
    List<Transaction> findOverdueTransactions();

    // Count active borrows by user
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.user.id = :userId AND t.status = 'ISSUED'")
    long countActiveByUserId(@Param("userId") Long userId);

    // Find all issued transactions (not returned)
    List<Transaction> findByStatus(Transaction.Status status);
}
