package com.library.dto;

import com.library.entity.Transaction;
import lombok.Data;
import java.time.LocalDate;

@Data
public class TransactionDto {

    private Long id;
    private Long userId;
    private String userName;
    private Long bookId;
    private String bookTitle;
    private String bookAuthor;
    private LocalDate issueDate;
    private LocalDate dueDate;
    private LocalDate returnDate;
    private Double fine;
    private Transaction.Status status;
}
