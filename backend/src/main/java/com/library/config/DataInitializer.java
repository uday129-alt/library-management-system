package com.library.config;

import com.library.entity.Book;
import com.library.entity.User;
import com.library.repository.BookRepository;
import com.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds the database with sample data on startup (if empty).
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private BookRepository bookRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsers();
        seedBooks();
    }

    private void seedUsers() {
        if (userRepository.count() > 0) return;

        userRepository.save(User.builder()
                .name("Admin User").email("admin@library.com")
                .password(passwordEncoder.encode("admin123"))
                .role(User.Role.ADMIN).build());

        userRepository.save(User.builder()
                .name("John Doe").email("john@example.com")
                .password(passwordEncoder.encode("user123"))
                .role(User.Role.USER).build());

        userRepository.save(User.builder()
                .name("Jane Smith").email("jane@example.com")
                .password(passwordEncoder.encode("user123"))
                .role(User.Role.USER).build());

        System.out.println("✅ Sample users seeded.");
    }

    private void seedBooks() {
        if (bookRepository.count() > 0) return;

        bookRepository.save(Book.builder().title("Clean Code").author("Robert C. Martin")
                .category("Technology").isbn("9780132350884").totalCopies(5).availableCopies(5)
                .description("A handbook of agile software craftsmanship.").publishedYear(2008).build());

        bookRepository.save(Book.builder().title("The Pragmatic Programmer").author("David Thomas")
                .category("Technology").isbn("9780135957059").totalCopies(3).availableCopies(3)
                .description("From journeyman to master.").publishedYear(2019).build());

        bookRepository.save(Book.builder().title("Design Patterns").author("Gang of Four")
                .category("Technology").isbn("9780201633610").totalCopies(4).availableCopies(4)
                .description("Elements of reusable object-oriented software.").publishedYear(1994).build());

        bookRepository.save(Book.builder().title("To Kill a Mockingbird").author("Harper Lee")
                .category("Fiction").isbn("9780061935466").totalCopies(6).availableCopies(6)
                .description("A novel about racial injustice and moral growth.").publishedYear(1960).build());

        bookRepository.save(Book.builder().title("1984").author("George Orwell")
                .category("Fiction").isbn("9780451524935").totalCopies(5).availableCopies(5)
                .description("A dystopian social science fiction novel.").publishedYear(1949).build());

        bookRepository.save(Book.builder().title("Sapiens").author("Yuval Noah Harari")
                .category("History").isbn("9780062316097").totalCopies(4).availableCopies(4)
                .description("A brief history of humankind.").publishedYear(2011).build());

        bookRepository.save(Book.builder().title("Atomic Habits").author("James Clear")
                .category("Self-Help").isbn("9780735211292").totalCopies(7).availableCopies(7)
                .description("An easy and proven way to build good habits.").publishedYear(2018).build());

        bookRepository.save(Book.builder().title("The Great Gatsby").author("F. Scott Fitzgerald")
                .category("Fiction").isbn("9780743273565").totalCopies(5).availableCopies(5)
                .description("A tale of the Jazz Age in Long Island.").publishedYear(1925).build());

        bookRepository.save(Book.builder().title("Introduction to Algorithms").author("Thomas H. Cormen")
                .category("Technology").isbn("9780262033848").totalCopies(3).availableCopies(3)
                .description("Comprehensive introduction to modern algorithms.").publishedYear(2009).build());

        bookRepository.save(Book.builder().title("The Alchemist").author("Paulo Coelho")
                .category("Fiction").isbn("9780062315007").totalCopies(8).availableCopies(8)
                .description("A philosophical novel about following your dreams.").publishedYear(1988).build());

        System.out.println("✅ Sample books seeded.");
    }
}
