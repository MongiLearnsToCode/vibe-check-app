<?php

namespace App\Policies;

use App\Models\Relationship;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class RelationshipPolicy
{
    use HandlesAuthorization;

    public function view(User $user, Relationship $relationship)
    {
        return $relationship->users->contains($user);
    }
}
