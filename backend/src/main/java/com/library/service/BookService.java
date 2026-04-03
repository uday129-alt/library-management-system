package com.library.service;

import com.library.dto.BookDto;
import com.library.entity.Book;
import com.library.exception.BadRequestException;
import com.library.exception.ResourceNotFoundException;
import com.library.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for all Book CRUD and search operations.
 */
@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    /** Get all books */
    public List<BookDto> getAllBooks() {
        return bookRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /** Get a single book by ID */
    public BookDto getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
        return toDto(book);
    }

    /** Search books by title, author, or category */
    public List<BookDto> searchBooks(String query) {
        return bookRepository.searchBooks(query).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /** Get books by category */
    public List<BookDto> getBooksByCategory(String category) {
        return bookRepository.findByCategory(category).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /** Add a new book (Admin only) */
    public BookDto addBook(BookDto bookDto) {
        if (bookRepository.existsByIsbn(bookDto.getIsbn())) {
            throw new BadRequestException("A book with ISBN " + bookDto.getIsbn() + " already exists");
        }

        Book book = toEntity(bookDto);
        book.setAvailableCopies(bookDto.getTotalCopies()); // initially all copies available
        return toDto(bookRepository.save(book));
    }

    /** Update an existing book (Admin only) */
    public BookDto updateBook(Long id, BookDto bookDto) {
        Book existing = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));

        int borrowedCopies = existing.getTotalCopies() - existing.getAvailableCopies();

        existing.setTitle(bookDto.getTitle());
        existing.setAuthor(bookDto.getAuthor());
        existing.setCategory(bookDto.getCategory());
        existing.setIsbn(bookDto.getIsbn());
        existing.setDescription(bookDto.getDescription());
        existing.setPublishedYear(bookDto.getPublishedYear());
        existing.setTotalCopies(bookDto.getTotalCopies());
        // Recalculate available copies based on how many are currently borrowed
        existing.setAvailableCopies(Math.max(0, bookDto.getTotalCopies() - borrowedCopies));

        return toDto(bookRepository.save(existing));
    }

    /** Delete a book (Admin only) */
    public void deleteBook(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new ResourceNotFoundException("Book not found with id: " + id);
        }
        bookRepository.deleteById(id);
    }

    // ---- Mappers ----

    public BookDto toDto(Book book) {
        BookDto dto = new BookDto();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        dto.setCategory(book.getCategory());
        dto.setIsbn(book.getIsbn());
        dto.setTotalCopies(book.getTotalCopies());
        dto.setAvailableCopies(book.getAvailableCopies());
        dto.setDescription(book.getDescription());
        dto.setPublishedYear(book.getPublishedYear());
        return dto;
    }

    private Book toEntity(BookDto dto) {
        return Book.builder()
                .title(dto.getTitle())
                .author(dto.getAuthor())
                .category(dto.getCategory())
                .isbn(dto.getIsbn())
                .totalCopies(dto.getTotalCopies())
                .availableCopies(dto.getTotalCopies())
                .description(dto.getDescription())
                .publishedYear(dto.getPublishedYear())
                .build();
    }
}
