package com.universe.backend.repositories;

import com.universe.backend.modules.Groups;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupsRepository extends JpaRepository<Groups, Integer>{
    
    @Override
    List<Groups> findAll();
    
    List<Groups> findByNameContainingIgnoreCase(String name);
}
