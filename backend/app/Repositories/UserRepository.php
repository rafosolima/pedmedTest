<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Contracts\IUserRepository;

class UserRepository extends AbstractRepository implements IUserRepository
{
	public function __construct(User $model)
	{
		$this->model = $model;
	}
}