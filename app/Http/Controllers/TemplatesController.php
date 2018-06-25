<?php

namespace App\Http\Controllers;

use App\Template;
use Illuminate\Http\Request;

class TemplatesController extends Controller
{
    public function index()
    {
        return Template::where('global', true)->orWhere('user_id', \Auth::user()->id)->paginate();
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['user_id'] = \Auth::user()->id;
        $data['global'] = false;
        $data['usages'] = 1;
        return Template::create($data);
    }

    public function update(Request $request, Template $template)
    {
        $data = [
            'title' => $request->all()['title'],
            'template' => $request->all()['template']
        ];

        $template->update($data);

        return $template;
    }
}
