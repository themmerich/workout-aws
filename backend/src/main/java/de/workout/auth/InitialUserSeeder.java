package de.workout.auth;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import de.workout.user.Role;
import de.workout.user.User;
import de.workout.user.UserRepository;
import lombok.RequiredArgsConstructor;

/**
 * Seeds two default users on first startup when the users table is empty.
 * Dev-only defaults; replace before production deploy.
 */
@Component
@RequiredArgsConstructor
public class InitialUserSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        if (userRepository.count() > 0) {
            return;
        }
        userRepository.save(User.builder()
                .username("admin@workout.local")
                .password(passwordEncoder.encode("admin1234"))
                .role(Role.ADMIN)
                .build());
        userRepository.save(User.builder()
                .username("user@workout.local")
                .password(passwordEncoder.encode("user1234"))
                .role(Role.USER)
                .build());
    }
}
