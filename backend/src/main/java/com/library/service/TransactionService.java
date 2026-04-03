package com.library.service;

import com.library.dto.TransactionDto;
import com.library.entity.Book;
import com.library.entity.Transaction;
import com.library.entity.User;
import com.library.exception.BadRequestException;
import com.library.exception.ResourceNotFoundException;
import com.library.repository.BookRepository;
import com.library.repository.TransactionRepository;
import com.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service handling book issue, return, and fine calculation logic.
 * Fine = overdue days × fine per day rate.
 */
@Service
public class TransactionService {

    private static final int LOAN_PERIOD_DAYS = 14; // 2-week loan period

    @Value("${app.fine.per-day:5.0}")
    private double finePerDay;

    @Autowired private TransactionRepository transactionRepository;
    @Autowired private BookRepository bookRepository;
    @Autowired private UserRepository userRepository;

    /**
     * Issue a book to a user.
     * Validates availability and that user hasn't already borrowed the same book.
     */
    @Transactional
    public TransactionDto issueBook(Long userId, Long bookId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found: " + bookId));

        // Check if user already has this book issued
        boolean alreadyIssued = transactionRepository
                .findByUserIdAndBookIdAndStatus(userId, bookId, Transaction.Status.ISSUED)
                .isPresent();
        if (alreadyIssued) {
            throw new BadRequestException("You have already borrowed this book.");
        }

        // Check availability
        if (book.getAvailableCopies() <= 0) {
            throw new BadRequestException("No copies of '" + book.getTitle() + "' are available.");
        }

        // Decrement available copies
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        // Create transaction record
        Transaction transaction = Transaction.builder()
                .user(user)
                .book(book)
                .issueDate(LocalDate.now())
                .dueDate(LocalDate.now().plusDays(LOAN_PERIOD_DAYS))
                .fine(0.0)
                .status(Transaction.Status.ISSUED)
                .build();

        return toDto(transactionRepository.save(transaction));
    }

    /**
     * Return a book and calculate any applicable fine.
     */
    @Transactional
    public TransactionDto returnBook(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found: " + transactionId));

        if (transaction.getStatus() == Transaction.Status.RETURNED) {
            throw new BadRequestException("This book has already been returned.");
        }

        LocalDate today = LocalDate.now();
        transaction.setReturnDate(today);
        transaction.setStatus(Transaction.Status.RETURNED);

        // Calculate fine if overdue
        double fine = calculateFine(transaction.getDueDate(), today);
        transaction.setFine(fine);

        // Increment available copies
        Book book = transaction.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        return toDto(transactionRepository.save(transaction));
    }

    /**
     * Calculate fine for overdue returns.
     * fine = max(0, overdueDays * finePerDay)
     */
    private double calculateFine(LocalDate dueDate, LocalDate returnDate) {
        long overdueDays = ChronoUnit.DAYS.between(dueDate, returnDate);
        return overdueDays > 0 ? overdueDays * finePerDay : 0.0;
    }

    /** Get all transactions for a specific user */
    public List<TransactionDto> getUserTransactions(Long userId) {
        return transactionRepository.findByUserId(userId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /** Get all transactions (Admin view) */
    public List<TransactionDto> getAllTransactions() {
        return transactionRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /** Get all overdue transactions */
    public List<TransactionDto> getOverdueTransactions() {
        return transactionRepository.findOverdueTransactions().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /** Get a single transaction by ID */
    public TransactionDto getTransactionById(Long id) {
        return toDto(transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found: " + id)));
    }

    // ---- Mapper ----

    private TransactionDto toDto(Transaction t) {
        TransactionDto dto = new TransactionDto();
        dto.setId(t.getId());
        dto.setUserId(t.getUser().getId());
        dto.setUserName(t.getUser().getName());
        dto.setBookId(t.getBook().getId());
        dto.setBookTitle(t.getBook().getTitle());
        dto.setBookAuthor(t.getBook().getAuthor());
        dto.setIssueDate(t.getIssueDate());
        dto.setDueDate(t.getDueDate());
        dto.setReturnDate(t.getReturnDate());
        dto.setFine(t.getFine());
        dto.setStatus(t.getStatus());
        return dto;
    }
}
