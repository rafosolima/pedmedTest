<?php

namespace App\Repositories\Contracts;

interface IScheduleRepository {
    public function find($id);
    public function findAll();
    public function create(array $data);
    public function update(array $data, $id);
    public function firstOrCreate(array $data);
    public function delete($id);
    public function findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null);
    public function findOneBy(array $criteria);
    public function paginate($pages);
}