package com.library.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookDto {

    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Author is required")
    private String author;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "ISBN is required")
    private String isbn;

    @NotNull(message = "Total copies is required")
    @Min(value = 1, message = "Must have at least 1 copy")
    private Integer totalCopies;

    private Integer availableCopies;

    private String description;

    private Integer publishedYear;
}
